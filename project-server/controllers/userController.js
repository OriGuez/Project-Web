const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.addUser = async (req, res) => {
    try {
        const { username, password, displayName, profilePic } = req.body;
        const userId = req.user.id; // Extracted from JWT
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create and save the new user
        const user = new User({ username, password: hashedPassword, displayName, profilePic });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const payload = {username: user.username };
        const token = jwt.sign(payload, 'jwtKey');

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};



// // Ensure that the user sent a valid token
// exports.isLoggedIn = (req, res, next) => {
//     // If the request has an authorization header
//     if (req.headers.authorization) {
//         // Extract the token from that header
//         const token = req.headers.authorization.split(" ")[1];
//         try {
//             // Verify the token is valid
//             const data = jwt.verify(token, key);
//             console.log('The logged in user is: ' + data.username);
//             // Token validation was successful. Continue to the actual function (index)
//             return next()
//         } catch (err) {
//             return res.status(401).send("Invalid Token");
//         }
//     }
//     else
//         return res.status(403).send('Token required');
// }