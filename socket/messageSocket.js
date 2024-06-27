const { User, Message } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.initializeMessageSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('a user connected to message socket');

        socket.on('authenticate', async (token) => {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                const user = await User.findOne({ where: { id: decoded.id } });
                if (user) {
                    socket.userId = user.id;
                    socket.email = user.email;
                    console.log(`User authenticated for messages: ${user.email}`);

                    // Handle incoming messages
                    socket.on('send_message', async (data) => {
                        const { recipientId, content } = data;
                        if (!recipientId || !content) {
                            return socket.emit('error', { message: 'Recipient and content are required.' });
                        }

                        // Save the message to the database
                        await Message.create({
                            senderId: user.id,
                            recipientId,
                            content
                        });

                        // Emit the message to the recipient if they are connected
                        io.to(recipientId).emit('receive_message', { senderId: user.id, content });
                    });
                } else {
                    socket.disconnect();
                }
            } catch (err) {
                socket.disconnect();
            }
        });

        socket.on('disconnect', () => {
            console.log('user disconnected from message socket');
        });
    });
};