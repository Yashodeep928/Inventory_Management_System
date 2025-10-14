import client from "../config/db.js";

// -------------------- User-side --------------------

// Get all orders for a specific user
const getUserOrders = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: 'User ID is required' });

  try {
    const result = await client.query(
      `SELECT o.order_id, o.order_status, o.order_date, u.name, u.email
       FROM orders o
       JOIN users u ON o.user_id = u.user_id
       WHERE u.user_id = $1`,
      [id]
    );

    const orders = result.rows;
    if (orders.length === 0) return res.status(404).json({ error: 'No orders found for this user' });

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new order for a user
const createUserOrder = async (req, res) => {
  const { id } = req.params;
  const { product_id, quantity, price } = req.body;

  if (!id || !product_id || !quantity || !price)
    return res.status(400).json({ error: "User ID, product ID, quantity, and price are required" });

  try {
    // 1️⃣ Check if product exists and has enough stock
    const productResult = await client.query(
      "SELECT quantity FROM products WHERE product_id = $1",
      [product_id]
    );

    if (productResult.rows.length === 0)
      return res.status(404).json({ error: "Product not found" });

    const availableQty = productResult.rows[0].quantity;
    if (quantity > availableQty)
      return res.status(400).json({ error: `Only ${availableQty} items available in stock` });

    // 2️⃣ Create new order with initial status 'pending' (lowercase)
    const orderResult = await client.query(
      "INSERT INTO orders (user_id, order_status) VALUES ($1, $2) RETURNING *",
      [id, "pending"] // lowercase to satisfy check constraint
    );
    const newOrder = orderResult.rows[0];

    // 3️⃣ Add product to order_products
    const orderProductResult = await client.query(
      "INSERT INTO order_products (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *",
      [newOrder.order_id, product_id, quantity, price]
    );

    // 4️⃣ Deduct stock from products table
    const updatedProduct = await client.query(
      "UPDATE products SET quantity = quantity - $1 WHERE product_id = $2 RETURNING *",
      [quantity, product_id]
    );

    res.status(201).json({
      order: newOrder,
      order_product: orderProductResult.rows[0],
      product: updatedProduct.rows[0],
    });
  } catch (error) {
    console.error("DB Error creating order:", error);
    res.status(500).json({ error: "Internal server error", detail: error.message });
  }
};

// -------------------- Admin-side --------------------

// List all orders with user info
const listAllOrders = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT o.order_id, o.order_status, o.order_date, u.user_id, u.name, u.email
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      ORDER BY o.order_date DESC
    `);
    res.status(200).json({ orders: result.rows });
  } catch (error) {
    console.error('Error listing orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// List customers who have placed at least one order
const listCustomersWithOrders = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT u.user_id, u.name, u.email, COUNT(o.order_id) AS orders_count
      FROM users u
      JOIN orders o ON u.user_id = o.user_id
      GROUP BY u.user_id
      ORDER BY orders_count DESC
    `);
    res.status(200).json({ customers: result.rows });
  } catch (error) {
    console.error('Error listing customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// -------------------- Admin Customers Features --------------------

// List all customers (even with 0 orders)
const listAllCustomers = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT 
        u.user_id, 
        u.name, 
        u.email,
        COALESCE(COUNT(o.order_id), 0) AS orders_count
      FROM users u
      LEFT JOIN orders o ON u.user_id = o.user_id
      GROUP BY u.user_id, u.name, u.email
      ORDER BY u.name ASC
    `);
    res.status(200).json({ customers: result.rows });
  } catch (error) {
    console.error('Error listing all customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Toggle active/inactive status
const toggleCustomerStatus = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'User ID is required' });

  try {
    const userResult = await client.query('SELECT active FROM users WHERE user_id = $1', [id]);
    if (userResult.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const currentStatus = userResult.rows[0].active;
    const updatedResult = await client.query(
      'UPDATE users SET active = $1 WHERE user_id = $2 RETURNING user_id, name, email, active',
      [!currentStatus, id]
    );

    res.status(200).json({ customer: updatedResult.rows[0] });
  } catch (error) {
    console.error('Error toggling customer status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get customer profile + all orders
const getCustomerDetails = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'User ID is required' });

  try {
    const userResult = await client.query('SELECT user_id, name, email,status FROM users WHERE user_id = $1', [id]);
    if (userResult.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const customer = userResult.rows[0];

    const ordersResult = await client.query(`
      SELECT o.order_id, o.order_status, o.order_date, op.product_id, op.quantity, op.price, p.name AS product_name
      FROM orders o
      JOIN order_products op ON o.order_id = op.order_id
      JOIN products p ON op.product_id = p.product_id
      WHERE o.user_id = $1
      ORDER BY o.order_date DESC
    `, [id]);

    res.status(200).json({ customer, orders: ordersResult.rows });
  } catch (error) {
    console.error('Error fetching customer details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// -------------------- Admin Orders Features --------------------

// Update order status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !status) return res.status(400).json({ error: 'Order ID and status are required' });

  try {
    // First get the order details before updating
    const orderResult = await client.query(
      'SELECT o.*, u.name as user_name, u.email FROM orders o JOIN users u ON o.user_id = u.user_id WHERE o.order_id = $1',
      [id]
    );

    if (orderResult.rows.length === 0) return res.status(404).json({ error: 'Order not found' });

    const order = orderResult.rows[0];

    // Ensure status is lowercase before updating (matches constraint)
    const validStatus = status.toLowerCase();

    const result = await client.query(
      'UPDATE orders SET order_status = $1 WHERE order_id = $2 RETURNING order_id, order_status, order_date, user_id',
      [validStatus, id]
    );

    // Create notification for the user
    const notificationMessages = {
      'confirmed': {
        title: 'Order Confirmed',
        message: `Your order #${id} has been confirmed and is being prepared.`
      },
      'shipped': {
        title: 'Order Shipped',
        message: `Your order #${id} has been shipped and is on its way to you.`
      },
      'delivered': {
        title: 'Order Delivered',
        message: `Your order #${id} has been delivered successfully. Thank you for your purchase!`
      },
      'cancelled': {
        title: 'Order Cancelled',
        message: `Your order #${id} has been cancelled. If you have any questions, please contact support.`
      }
    };

    const notification = notificationMessages[validStatus];
    if (notification) {
      try {
        await client.query(
          'INSERT INTO notifications (user_id, type, title, message, order_id) VALUES ($1, $2, $3, $4, $5)',
          [order.user_id, 'order_update', notification.title, notification.message, id]
        );
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
    }

    res.status(200).json({ order: result.rows[0] });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { 
  createUserOrder, 
  getUserOrders, 
  listAllOrders, 
  listCustomersWithOrders, 
  listAllCustomers, 
  toggleCustomerStatus, 
  getCustomerDetails, 
  updateOrderStatus 
};
