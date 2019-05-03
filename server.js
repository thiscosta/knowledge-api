const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const requireDir = require('require-dir')
const mongoose = require('mongoose')
require('dotenv-safe').load()

const app = express()

app.use(express.json())
app.use(cors())


mongoose.connect('mongodb://localhost:27017/knowledge', { useNewUrlParser: true })

requireDir('./src/models')

app.use('/', require('./src/routes'))

app.listen(4040)