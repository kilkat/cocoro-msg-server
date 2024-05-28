const { User } = require('../models');
const bcrypt = require('bcrypt');

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
        return res.status(400).json({ message: "Passwords do not match." });
    }

    try {
        // 이메일 중복 검사
        const existingEmail = await User.findOne({ where: { email: email } });
        if (existingEmail) {
            return res.status(409).json({ message: "Email already exists." });
        }

        // 이름 중복 검사
        const existingName = await User.findOne({ where: { name: name } });
        if (existingName) {
            return res.status(409).json({ message: "Name already exists." });
        }

        // 전화번호 중복 검사
        const existingPhone = await User.findOne({ where: { phone: phone } });
        if (existingPhone) {
            return res.status(409).json({ message: "Phone number already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email: email,
            name: name,
            phone: phone,
            password: hashedPassword
        });

        res.status(201).json({ message: "User created successfully.", user: newUser });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ message: "Internal server error." });
    }
}
