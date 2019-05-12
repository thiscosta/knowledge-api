const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const requireDir = require('require-dir')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })

requireDir('./src/models')
require('./src/config/passport');

app.use('/', require('./src/routes'))

app.listen(process.env.PORT)