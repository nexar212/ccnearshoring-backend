const User = require('../models/users');
const bcrypt = require('bcryptjs');
const  jwt = require('jsonwebtoken');
const  {verify} = require('jsonwebtoken');
const { serialize } = require('cookie')

exports.profile = async (req, res) => {
    try {
        const {myToken} = req.cookies;
        const userData = verify(myToken, process.env.JWT_SECRET);
        const userEmail = userData.user.email

        const user = await User.findOne({ email: userEmail});

        if (!user) {
            return res.status(40).json({ msg: 'User not found' });
        }

        res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        })
        res.status(200)
    } catch (error) {
        res.cookie('myToken', '', {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            expires: new Date(0),
            path: '/'
        });
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

        const response = await user.save();

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
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

        const payload = {
            user: {
                id: user.id,
                email: user.email,
                name: user.firstName,
                role: user.role
            }
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 60 }
        );

        const serialized = serialize('myToken', token, {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60,
            path: '/'
        });

        res.setHeader('Set-Cookie', serialized)
        res.status(200).json({message: 'log in succesfully'})
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.logout = async (req, res) => {
    try {
        res.cookie('myToken', '', {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            expires: new Date(0),
            path: '/'
        });
    
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        return res.status(401).json({error: 'Invalid token'})
    }
}