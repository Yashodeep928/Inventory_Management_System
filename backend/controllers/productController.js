import client from '../config/db.js'

const addProduct = async(req,res)=>{

    try {

        const {name,category,price,quantity} = req.body;


         if(name||category||price||quantity){

            const existingProduct = await client.query('SELECT * FROM products WHERE name = $1', [name]);

            if (existingProduct.rows.length > 0) {
                return res.status(400).json({ error: 'Product already exists' });
            }

        }



        const result = await client.query('INSERT INTO products (name, category, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *', [name, category, price, quantity]);

        console.log('Product added:', result.rows[0]);

        res.status(201).json({ product: result.rows[0] });

    } catch (error) {
        console.log('Error adding product:', error);

        res.status(500).json({ error: 'Internal Server Error' });
    }

}



const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, price, quantity } = req.body;

        const result = await client.query('UPDATE products SET name = $1, category = $2, price = $3, quantity = $4 WHERE id = $5 RETURNING *', [name, category, price, quantity, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        console.log('Product updated:', result.rows[0]);

        res.status(200).json({ product: result.rows[0] });

    } catch (error) {
        console.log('Error updating product:', error);

        res.status(500).json({ error: 'Internal Server Error' });
    }
}



const deactivateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await client.query('UPDATE products SET active = false WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        console.log('Product deactivated:', result.rows[0]);

        res.status(200).json({ product: result.rows[0] });

    } catch (error) {
        console.log('Error deactivating product:', error);

        res.status(500).json({ error: 'Internal Server Error' });
    }
}






export { addProduct, updateProduct, deactivateProduct };