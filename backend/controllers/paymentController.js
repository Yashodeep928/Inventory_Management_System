import razorpay from "../config/razorpay.js";


const createOrder = async (req, res) => {

    const { amount, currency } = req.body;

    try {
        const options = {
            amount: amount , 
            currency: currency,
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        if (!order) {
            return res.status(500).json({ error: 'Failed to create order' });
        }
        console.log('Razorpay order created successfully:', order);
        res.status(201).json(order);
    } catch (error) {
        console.log('Error creating Razorpay order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export { createOrder };
