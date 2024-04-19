const mongoose = require('mongoose');

const RecipesSchema = new mongoose.Schema({
    name: String,
    description : String,
    ingredients : { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredients'},
});

const Recipes = mongoose.model('Recipes', RecipesSchema);

module.exports = Recipes;