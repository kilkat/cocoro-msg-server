const { User, Friends } = require('../models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
require('dotenv').config();

module.exports.initializeFriendSocket = (io) => {
    const users = {}; // Keep track of connected users and their intervals

    io.on('connection', (socket) => {
        console.log('a user connected to friend socket');

        socket.on('authenticate', async (token) => {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                const user = await User.findOne({ where: { id: decoded.id } });
                if (user) {
                    socket.userId = user.id;
                    socket.email = user.email;
                    console.log(`User authenticated: ${user.email}`);

                    // Start sending friend lists periodically
                    users[socket.id] = setInterval(async () => {
                        try {
                            const friends = await Friends.findAll({ where: { userId: user.id } });
                            const friendsId = friends.map(friend => friend.friendId).sort((a, b) => a - b);
                            const friendInfo = await User.findAll({ where: { id: { [Op.in]: friendsId } } });
                            const sanitizedFriends = friendInfo.map(friend => ({
                                id: friend.id,
                                email: friend.email,
                                name: friend.name,
                                phone: friend.phone,
                                createdAt: friend.createdAt,
                                updatedAt: friend.updatedAt
                            }));
                            socket.emit('friend_list', { friends: sanitizedFriends });
                        } catch (error) {
                            console.error("Error fetching friend list: ", error);
                        }
                    }, 10000); // 10초마다 전송
                } else {
                    socket.disconnect();
                }
            } catch (err) {
                socket.disconnect();
            }
        });

        socket.on('disconnect', () => {
            console.log('user disconnected from friend socket');
            clearInterval(users[socket.id]); // Clear the interval when user disconnects
            delete users[socket.id];
        });
    });
};