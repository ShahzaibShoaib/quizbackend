const mongoose = require('mongoose');

const IngredientsSchema = new mongoose.Schema({
    name: String,
    description : String,
    
});

const Ingredients = mongoose.model('Ingredients', IngredientsSchema);

module.exports = Ingredients;