const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../model/Users');
const Recipe = require('../model/Recipes');
const Ingredient = require('../model/Ingredients');

function verifyToken(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    const [bearer, token] = authorizationHeader ? authorizationHeader.split(' ') : [];

    if (!token) {
        return res.status(403).json({ error: 'Unauthorized: Token not provided' });
    }

    jwt.verify(token, 'Secret123', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
        req.user = decoded;
        next();
    });
}


function verifyAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {

        const decoded = jwt.verify(token, 'Secret123');
        console.log(decoded);

        console.log(decoded.admin);
        if (decoded.admin !== true) {
            return res.status(403).json({ error: 'Unauthorized: Admin access only' });
        }

        req.user = decoded;
        
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Unauthorized: Invalid token' });
    }
}


router.post('/admin/add-ingredient', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const newIngredient = new Ingredient(req.body);
        const savedIngredient = await newIngredient.save();
        res.json(savedIngredient);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/admin/add-recipe', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { name, description, ingredients } = req.body;
        
        const ingredientObjects = await Ingredient.find({ _id: { $in: ingredients } });
        if (ingredientObjects.length !== ingredients.length) {
            return res.status(400).json({ error: 'Some ingredients are invalid' });
        }

        const newRecipe = new Recipe({ name, description, ingredients });
        const savedRecipe = await newRecipe.save();
        res.json(savedRecipe);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/recipes', verifyToken, async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('ingredients');
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/recipes/:id', verifyToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('ingredients');
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/ingredients', async (req, res) => {
    try {
        const ingredientsList = await Ingredients.find();
        
        res.json(ingredientsList);
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
