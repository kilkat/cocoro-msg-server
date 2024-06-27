const { User, ChatRoom, ChatRoomMembers, Message } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op, Sequelize } = require('sequelize');
require('dotenv').config();

module.exports.chatCreate = async (req, res, next) => {
    const { chatTitle, userEmail, friendEmail } = req.body;

    if (!userEmail || !friendEmail) {
        return res.status(400).json({ message: "User email and friend email are required." });
    }

    try {
        // 1. 사용자 이메일로 사용자 검색
        const user = await User.findOne({ where: { email: userEmail } });
        const friend = await User.findOne({ where: { email: friendEmail } });

        if (!user || !friend) {
            return res.status(404).json({ message: "User or friend not found." });
        }

        // 2. 이미 채팅방이 있는지 확인
        const existingChatRoom = await ChatRoom.findOne({
            include: [{
                model: ChatRoomMembers,
                as: 'Members',
                where: {
                    userId: { [Op.or]: [user.id, friend.id] }
                }
            }],
            group: ['ChatRoom.id'],
            having: Sequelize.literal(`COUNT(DISTINCT "Members"."userId") = 2`)
        });

        if (existingChatRoom) {
            return res.status(200).json({ message: "Chat room already exists.", chatRoomId: existingChatRoom.id });
        }

        // 3. 채팅방 생성
        const chatRoom = await ChatRoom.create({ name: chatTitle });

        // 4. 사용자와 친구를 채팅방 멤버로 추가
        await ChatRoomMembers.bulkCreate([
            { chatroomId: chatRoom.id, userId: user.id },
            { chatroomId: chatRoom.id, userId: friend.id }
        ]);

        res.status(201).json({ message: "Chat room created successfully.", chatRoomId: chatRoom.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error." });
    }
}
