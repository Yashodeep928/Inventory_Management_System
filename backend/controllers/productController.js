import client from "../config/db.js";

// 🟢 Add a new product
const addProduct = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    if (!name || !category || price === undefined || quantity === undefined) {
      return res
        .status(400)
        .json({ error: "All fields (name, category, price, quantity) are required" });
    }

    // Check if product already exists
    const existingProduct = await client.query(
      "SELECT * FROM products WHERE name = $1",
      [name]
    );
    if (existingProduct.rows.length > 0) {
      return res.status(400).json({ error: "Product already exists" });
    }

    // Insert product (active will default to true in DB)
    const result = await client.query(
      `INSERT INTO products (name, category, price, quantity)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, category, price, quantity]
    );

    console.log("✅ Product added:", result.rows[0]);
    res.status(201).json({ product: result.rows[0] });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 🟢 Update existing product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, quantity, active } = req.body;

    const result = await client.query(
      `UPDATE products 
       SET name = $1, category = $2, price = $3, quantity = $4, 
           active = COALESCE($5, active), updated_at = NOW()
       WHERE product_id = $6 
       RETURNING *`,
      [name, category, price, quantity, active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("✅ Product updated:", result.rows[0]);
    res.status(200).json({ product: result.rows[0] });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 🟢 Deactivate (soft delete) product
const deactivateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await client.query(
      "UPDATE products SET active = false, updated_at = NOW() WHERE product_id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("🟠 Product deactivated:", result.rows[0]);
    res.status(200).json({ product: result.rows[0] });
  } catch (error) {
    console.error("❌ Error deactivating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 🟢 List all active products
const listProducts = async (req, res) => {
  try {
    const result = await client.query(
      "SELECT * FROM products WHERE active = true ORDER BY product_id DESC"
    );
    res.status(200).json({ products: result.rows });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 🟢 Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await client.query("SELECT * FROM products WHERE product_id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ product: result.rows[0] });
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { addProduct, updateProduct, deactivateProduct, listProducts, getProductById };
