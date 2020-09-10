const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('mongoose');

const fs = require('fs');

// Load ENV
const { config } = require("dotenv");
config();

app.use(cors({origin: '*'}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

const user = require('./routes/user')
const auth = require('./routes/auth')
// const news = require('./routes/news')

const port = process.env.PORT
const colors = require('colors')

// s3.listBuckets({}, function(err, data) {
//     if (err) console.log(err, err.stack);
//     else {
//         data['Buckets'].forEach(function(space) {
//             console.log(space['Name']);
//         })
//     };
// });

app.use('/user', user)
app.use('/auth', auth)
// app.use('/news', news)

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true})
    .then(() => {console.log(`DB: `.red + `Run on http://${process.env.DB_HOST}:${process.env.DB_PORT}`.yellow) 
        app.listen(port, () => {
            console.log(`Server: `.red + `Run on ${process.env.BASE_URL}:${port}`.yellow)
        })
    })
    .catch(() => {console.log("Data Base Error")})