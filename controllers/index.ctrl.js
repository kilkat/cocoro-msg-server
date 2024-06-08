const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports.getTest = (req, res, next) => {
    res.send('cocoro-chat index Page');
}

module.exports.userCreate = async (req, res, next) => {
    const body = req.body;
    const email = body.email;
    const name = body.name;
    const phone = body.phone;
    const password = body.password;
    const re_password = body.confirmPassword;

    if (!email || !name || !phone || !password || !re_password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== re_password) {
        return res.status(401).json({ message: "Passwords do not match." });
    }

    try {
        const existingEmail = await User.findOne({ where: { email: email } });
        if (existingEmail) {
            return res.status(409).json({ message: "Email already exists." });
        }

        const existingName = await User.findOne({ where: { name: name } });
        if (existingName) {
            return res.status(409).json({ message: "Name already exists." });
        }

        const existingPhone = await User.findOne({ where: { phone: phone } });
        if (existingPhone) {
            return res.status(409).json({ message: "Phone number already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userCreate = await User.create({
            email: email,
            name: name,
            phone: phone,
            password: hashedPassword
        });

        res.status(200).json({ message: "User created successfully.", user: userCreate });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ message: "Internal server error." });
    }
}

module.exports.userLogin = async (req, res, next) => {
    const body = req.body;
    const email = body.email;
    const password = body.password;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const user = await User.findOne({ where: { email: email } });
        console.log("userInfo: " + user);

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ message: "Login successful.", token: token, name: user.name });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: "Internal server error." });
    }
}

module.exports.userFriends = async (req, res, next) => {
    
}