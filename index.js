const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const recipesRouter = require('./routes/crud'); 

require("dotenv").config();

const app = express();
const PORT =  3000;
const dburl = 'mongodb+srv://atlasdb:abc123abc@cluster0.e664uml.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const cors =require('cors');

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

async function connectToDatabase() {
    try {
        await mongoose.connect(dburl);
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

connectToDatabase();

app.use('/auth', authRouter);
app.use('/crud', recipesRouter);



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
