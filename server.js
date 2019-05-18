const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const requireDir = require('require-dir')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

requireDir('./src/models')
require('./src/config/passport');

app.use('/', require('./src/routes'))

app.listen(process.env.PORT)