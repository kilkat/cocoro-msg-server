const { User, Friends } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

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

        res.status(200).json({ message: "User created successfully.", email: userCreate.email, name: userCreate.name, phone: userCreate.phone });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ message: "Internal server error." });
    }
}

module.exports.userLogin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const user = await User.findOne({ where: { email: email } });
        // console.log("user id info: " + JSON.stringify(user.id));

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        const userId = user.id;
        // console.log("====================")
        // console.log("userInfo: " + userId);
        // console.log("====================")
        const friends = await Friends.findAll({ where: { userId } });

        // console.log("friends id info: " + JSON.stringify(friends));

        const friendsId = friends.map(friend => friend.friendId).sort((a, b) => a - b);
        console.log("sorted friends id: " + JSON.stringify(friendsId));

        const friendInfo = await User.findAll({ where: { id: { [Op.in]: friendsId } } });
        console.log("Friends info: " + JSON.stringify(friendInfo));

        console.log("token: " + token);
        return res.status(200).json({ message: "Login successful.", token: token, name: user.name, friends: friendInfo });
    } catch (err) {
        console.error("Error during login: ", err);
        return res.status(500).json({ message: "Internal server error." });
    }
}


module.exports.userSearch = async (req, res, next) => {
    const body = req.body;
    const email = body.email;

    if (!email){
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await User.findOne({ where: { email: email } });
        console.log("test");
        if (user) {
            console.log("userInfo_2: ", user.toJSON());
        } else {
            console.log("userInfo_2: No user found");
        }

        if (!user){
            return res.status(401).json({ message: "Invalid email" });
        }

        return res.status(200).json({ message: "User search success", email: user.email, name: user.name });
    } catch(err) {
        console.error("Error during search: ", err);
        return res.status(500).json({ message: "Internal server error." });
    }
}

module.exports.addFriend = async (req, res, next) => {
    const { userEmail, friendEmail } = req.body;

    if (!userEmail || !friendEmail) {
        return res.status(400).json({ message: "User email and friend email are required." });
    }

    try {
        const user = await User.findOne({ where: { email: userEmail } });
        const friend = await User.findOne({ where: { email: friendEmail } });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (!friend) {
            return res.status(404).json({ message: "Friend not found." });
        }

        await Friends.create({
            userId: user.id,
            friendId: friend.id
        });

        return res.status(200).json({ message: "Friend added successfully." });
    } catch (error) {
        console.error("Error adding friend:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};