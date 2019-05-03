const mongoose = require('mongoose')

const CategoriesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    subcategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }]
}, {
        timestamps: true
    })

module.exports = mongoose.model('Category', CategoriesSchema)