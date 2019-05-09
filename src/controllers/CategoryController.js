const Categories = require('../models/Category')
const Articles = require('../models/Article')
const { validationResult } = require('express-validator/check')
const mongoose = require('mongoose');


class CategoryController {

    constructor() {
        this.index = this.index.bind(this)
        this.store = this.store.bind(this)
        this.show = this.show.bind(this)
        this.update = this.update.bind(this)
        this.destroy = this.destroy.bind(this)
        this.withPath = this.withPath.bind(this)
        this.getTree = this.getTree.bind(this)
        this.toTree = this.toTree.bind(this)
    }

    async index(req, res) {
        const categories = await Categories.find()

        return res.json(await this.withPath(categories))
    }

    async store(req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) res.status(422).json({ errors: errors.array() })

        if (!req.body) return res.status(400).json({ success: false, message: 'Categories must be provided' })

        if (req.body.parentId && req.body.parentId.length) {

            if (!mongoose.Types.ObjectId.isValid(req.body.parentId)) return res.status(400).json({ success: false, message: 'The value ' + req.body.parentId + ' isn\'t a valid id' })

            const parent = await Categories.findById(req.body.parentId)

            if (!parent) return res.status(400).json({ success: false, message: 'The category with id ' + req.body.parentId + ' doesn\'t exist' })

            const category = await Categories.create(req.body)

            parent.subcategories.push(category)
            await parent.save()

            return res.json(category)

        } else {
            delete req.body.parentId

            const category = await Categories.create(req.body)

            return res.json(category)
        }

    }

    async show(req, res) {
        const category = await Categories.findById(req.params.id)

        if (!category) return res.status(404).json({ success: false, message: 'Categories with id ' + req.params.id + ' doesn\'t exists' })

        return res.json(category)
    }

    async update(req, res) {
        const category = await Categories.findByIdAndUpdate(req.params.id, req.body, { new: true })

        if (!category) return res.status(404).json({ success: false, message: 'Categories with id ' + req.params.id + ' doesn\'t exists' })

        return res.json(category)
    }

    async destroy(req, res) {

        const subcategories = await Categories.find({ parentId: req.params.id })

        if (subcategories.length > 0) return res.status(400).json({ success: false, message: 'The category has subcategories' })

        const articles = await Articles.find({ category: req.params.id })

        if (articles.length > 0) return res.status(400).json({ success: false, message: 'The category has articles' })

        await Categories.findByIdAndDelete(req.params.id)
        return res.status(204).send()
    }

    withPath(categories) {
        if (!Array.isArray(categories)) {
            let arrayCategories = []
            arrayCategories.push(categories)
            categories = arrayCategories.slice(0)
        }
        const categoriesWithPath = categories.map((category) => {
            let path = category.name
            let parentFound = categories.filter(parent => parent._id == (category.parentId ? category.parentId.toString() : undefined))
            let parent = parentFound.length ? parentFound[0] : null

            while (parent) {
                path = `${parent.name} > ${path}`
                parentFound = categories.filter(element => element._id == (parent.parentId ? parent.parentId.toString() : undefined))
                parent = parentFound.length ? parentFound[0] : null
            }

            let categoryWithpath = { ...category }._doc
            return { ...categoryWithpath, path }
        })

        categoriesWithPath.sort((a, b) => {
            if (a.path < b.path) return -1
            if (a.path > b.path) return 1
            return 0
        })

        return categoriesWithPath
    }

    toTree(categories, tree) {
        if (!tree) tree = categories.filter(c => !c.parentId)
        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode._id.toString()
            parentNode = { ...parentNode }._doc
            parentNode.children = (this.toTree(categories, categories.filter(isChild)))
            return parentNode
        })
        return tree
    }

    async getTree(req, res) {
        let categories = await Categories.find()
        let tree = this.toTree(categories)
        return res.json(tree)
    }

}
module.exports = new CategoryController()