const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    admin: Boolean,
    recipes : { type: mongoose.Schema.Types.ObjectId, ref: 'Recipes'},

   
});

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;