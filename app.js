const express = require('express');
const http = require('http');
const app = express();
const port = process.env.PORT || 80;
const { sequelize } = require('./models');
const { initializeSocket } = require('./controllers/index.ctrl');
require('dotenv').config();

async function syncDatabase() {
    try {
        await sequelize.sync({ force: false });
        console.log('데이터 베이스 연결 성공');
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
initializeSocket(server); // 서버 인스턴스를 전달하여 소켓 초기화

server.listen(port, () => {
    console.log(`server is listening at http://localhost:${port}`);
});
