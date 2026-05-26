const mongoose = require('mongoose');

// We use { strict: false } here so Mongoose will accept whatever fields
// you have already inserted into your MongoDB collection, without 
// us having to define every single field exactly beforehand.
const dataSchema = new mongoose.Schema({}, { strict: false });

// The first argument 'Data' is the singular name of the collection.
// Mongoose automatically looks for the plural, lowercased version of this name.
// Thus, for the model 'Data', Mongoose will look for the 'datas' collection by default.
// To force it to use 'data' (your specific collection name), we pass a third argument.
const Data = mongoose.model('Data', dataSchema, 'data');

module.exports = Data;
