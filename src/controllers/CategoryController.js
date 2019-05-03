const Categories = require('../models/Category')
const Articles = require('../models/Article')

class CategoryController {

    constructor() {
        this.index = this.index.bind(this)
        this.store = this.store.bind(this)
        this.show = this.show.bind(this)
        this.update = this.update.bind(this)
        this.destroy = this.destroy.bind(this)
        this.withPath = this.withPath.bind(this)
    }

    async index(req, res) {
        const categories = await Categories.find()

        return res.json(await this.withPath(categories))
    }

    async store(req, res) {
        if (!req.body) return res.status(400).json({ success: false, message: 'Categories must be provided' })

        const category = await Categories.create(req.body)

        if(category.parentId){
            const parent = await Categories.findById(category.parentId)
            parent.subcategories.push(category)
            await parent.save()
        }

        return res.json(category)
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

        const subcategories = Categories.find({ parentId: req.params.id })

        if (subcategories) return res.status(400).json({ success: false, message: 'The category has subcategories' })

        const articles = Articles.find({ categoryId: req.params.id })

        if (articles) return res.status(400).json({ success: false, message: 'The category has articles' })

        await Categories.findByIdAndDelete(req.params.id)
        return res.status(204).send()
    }

    async withPath(categories) {
        if (!Array.isArray(categories)) {
            let arrayCategories = []
            arrayCategories.push(categories)
            categories = arrayCategories.slice(0)
        }
        const categoriesWithPath = categories.map((category) => {
            let path = category.name
            let parentFound = categories.filter(parent => parent._id == (category.parentId ? category.parentId.toString() : undefined ) )
            let parent = parentFound.length ? parentFound[0] : null

            while (parent) {
                path = `${parent.name} > ${path}`
                parentFound = categories.filter(element => element._id == (parent.parentId ? parent.parentId.toString() : undefined ))
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

}
module.exports = new CategoryController()