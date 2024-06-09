const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const router = require('./routers');
const { sequelize } = require('./models');
require('dotenv').config();

async function syncDatabase() {
    try {
        // await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });
        await sequelize.sync({ force: false });
        // await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true });
        console.log('데이터 베이스 연결 성공');
    } catch (err) {
        console.log(err);
    }
}

syncDatabase();

app.use(express.json());

app.use('/', router);
app.use('/user/userCreate', router);
app.use('/user/userLogin', router);
app.use('/user/userSearch', router);
app.use('/user/addFriend', router);

app.listen(port, () => {
    console.log(`server is listening at localhost:${process.env.PORT}`);
});
