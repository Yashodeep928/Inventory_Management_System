import client from '../config/db.js'
import bcrypt from 'bcrypt';

const saltRounds = 10;

const registeruser = async (req,res) => {
     
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      if(name || email){
        const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }
      }

    try {

        const hashedpassword = await bcrypt.hash(password, saltRounds);


        const result = await client.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, hashedpassword]);

        console.log(result.rows[0]);

        res.status(201).json({ user: result.rows[0] });

      }
       catch (error) 
      {
        console.log('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
      }  
}


const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        console.log('User logged in:', user.email);

        res.status(200).json({ user });
    } catch (error) {
        console.log('Error logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const forgotPassword = async (req, res) => {

    const { email } = req.body;

    try {


        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        





        
    } catch (error) {
        
    }


}



export { registeruser, login };