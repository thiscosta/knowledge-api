const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const requireDir = require('require-dir')
const mongoose = require('mongoose')

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge', { useNewUrlParser: true })

requireDir('./src/models')
require('./src/config/passport');

app.use('/', require('./src/routes'))

app.listen(process.env.PORT || 4040)