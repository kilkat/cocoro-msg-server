const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const router = require('./routers');
const {sequelize} = require('./models');
require('dotenv').config();

sequelize.sync({force : false})
.then(() => {
    console.log('데이터 베이스 연결 성공');
})
.catch((err) => {
    console.log(err);
});

app.use(express.json());

// app.use(bodyParser.json())
// app.use(
//     bodyParser.urlencoded({
//         extended: false,
//     })
// );

// app.use(cookieParser());

// app.use(
//     expressSession({
//         secret: "secret",
//         resave: true,
//         saveUninitialized: true,
//     })
// );

app.use('/', router);
app.use('/userCreate', router);

app.listen(port, () => {
    console.log(`server is listening at localhost:${process.env.PORT}`);
});