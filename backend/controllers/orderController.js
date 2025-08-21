import client from "../config/db.js";


const getUserOrders = async (req, res) => {

const {id} = req.params;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const result = await client.query(
            'SELECT o.order_id, o.order_status, o.order_date, u.name, u.email FROM orders o JOIN users u ON o.user_id = u.user_id WHERE u.user_id = $1',
            [id]
        );
        const orders = result.rows;

        if (orders.length === 0) {
            return res.status(404).json({ error: 'No orders found for this user' });
        }

        res.status(200).json({ orders });

    } catch (error) {
        console.log('Error fetching user orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const createUserOrder = async (req, res) => {
    const { id } = req.params;  // this is user_id
    const { product_id, quantity, price } = req.body; // use product_id instead of name

    if (!id || !product_id || !quantity || !price) {
        return res.status(400).json({ error: 'User ID, product ID, quantity, and price are required' });
    }

    try {
        // Step 1: Create new order for the user
        const orderResult = await client.query(
            'INSERT INTO orders (user_id) VALUES ($1) RETURNING *',
            [id]
        );

        const newOrder = orderResult.rows[0];

        // Step 2: Add product to order_products (junction table)
        const orderProductResult = await client.query(
            'INSERT INTO order_products (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *',
            [newOrder.order_id, product_id, quantity, price]
        );

        res.status(201).json({
            order: newOrder,
            order_product: orderProductResult.rows[0]
        });

    } catch (error) {
        console.error('Error creating user order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



export { getUserOrders, createUserOrder };