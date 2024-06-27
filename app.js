const express = require('express');
const http = require('http');
const app = express();
const port = process.env.PORT || 80;
const { sequelize } = require('./models');
const { initializeFriendSocket } = require('./socket/friendSocket');
const { initializeMessageSocket } = require('./socket/messageSocket');
require('dotenv').config();

async function syncDatabase() {
    try {
        // 외래 키 제약 조건 비활성화
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        
        // 데이터베이스 동기화
        await sequelize.sync({ force: false });
        
        // 외래 키 제약 조건 활성화
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        
        console.log('데이터베이스 연결 성공');
    } catch (err) {
        console.log(err);
    }
}

syncDatabase();

app.use(express.json());

// Router setting
const router = require('./routers');
app.use('/', router);

const server = http.createServer(app);
const io = require('socket.io')(server);

initializeFriendSocket(io.of('/friends')); // '/friends' 네임스페이스 사용
initializeMessageSocket(io.of('/messages')); // '/messages' 네임스페이스 사용

server.listen(port, () => {
    console.log(`server is listening at http://localhost:${port}`);
});
