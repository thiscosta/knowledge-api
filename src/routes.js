const express = require('express')

const UserController = require('./controllers/UserController')
const StatisticsController = require('./controllers/StatisticsController')
const UserRoutes = require('./routes/user')
const ArticleRoutes = require('./routes/articles')
const CategoryRoutes = require('./routes/categories')
const AuthController = require('./controllers/AuthController')

const routes = express.Router()

//Authentication
routes.post('/signup', UserController.store)
routes.post('/signin', AuthController.signin)

routes.get('/statistics', StatisticsController.index)

//User routes
routes.use('/users', UserRoutes)

//Article routes
routes.use('/articles', ArticleRoutes)

//Category routes
routes.use('/categories', CategoryRoutes)

module.exports = routes