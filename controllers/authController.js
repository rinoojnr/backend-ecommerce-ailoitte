const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/User');


exports.register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password) return res.status(400).json({ 
            success: false, 
            message: 'Required email and password.'
        })
        const existingData = await User.findOne({ where: { email} });
        if (existingData) return res.status(400).json({ success: false, message: 'Email already exists.' });
        
        const hash = await bcrypt.hash(password, 10);
        const userData = await User.create({ email, password: hash, role });
        
        res.status(201).json({ success: true, message: 'User registered successfully.' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}

exports.login = async (req, res) => {
    try {
        const  { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Required email and password.' });
        
        const userData = await User.findOne({ where: { email }});
        if (!userData) return res.status(404).json({ success: false, message: 'Account with this email was not found.' });
        
        const checkPassword = await bcrypt.compare(password, userData.password);
        if (!checkPassword) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

        const token = jwt.sign(
            {
                id: userData.id,
                role: userData.role
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.status(200).json({ success: true, message: 'Logged in successfully.', token })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}