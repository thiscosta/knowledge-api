const express = require('express')

const UserController = require('./controllers/UserController')
const CategoryController = require('./controllers/CategoryController')
const ArticleController = require('./controllers/ArticleController')

const routes = express.Router()

//User routes
routes.get('/users', UserController.index)
routes.post('/users', UserController.store)
routes.get('/users/:id', UserController.show)
routes.put('/users/:id', UserController.update)
routes.delete('/users/:id', UserController.destroy)

//Category routes
routes.get('/categories', CategoryController.index)
routes.post('/categories', CategoryController.store)
routes.get('/categories/:id', CategoryController.show)
routes.put('/categories/:id', CategoryController.update)
routes.delete('/categories/:id', CategoryController.destroy)

//Article routes
routes.get('/articles', ArticleController.index)
routes.post('/articles', ArticleController.store)
routes.get('/articles/:id', ArticleController.show)
routes.put('/articles/:id', ArticleController.update)
routes.delete('/articles/:id', ArticleController.destroy)


module.exports = routes