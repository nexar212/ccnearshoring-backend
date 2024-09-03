const User = require('../models/users');
const bcrypt = require('bcryptjs');
const  jwt = require('jsonwebtoken');
const  {verify} = require('jsonwebtoken');

exports.profile = async (req, res) => {
    try {

        const token = req.headers.authorization?.split(' ')[1];

        const userData = verify(token, process.env.JWT_SECRET);

        const userEmail = userData.email

        const user = await User.findOne({ email: userEmail});

        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        })
    } catch (error) {
        res.status(401).json({ error: 'invalid token'})
    }
};

exports.register = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            firstName,
            lastName,
            email,
            password,
            role
        });

        await user.save();

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {

    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        if(!user.password === password){
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({ 
            id: user.id,
            email: user.email,
            name: user.firstName,
            role: user.role
         }, process.env.JWT_SECRET, { expiresIn: '1h' });
 
        res.status(200).json({message: 'log in succesfully', token})
    } catch (err) {
        res.status(500).send('Server error');
    }
};
