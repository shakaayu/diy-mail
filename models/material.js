var mongoose = require('mongoose');

//path and originalname are the fields stored in mongoDB
var imageSchema = mongoose.Schema({
courseCode: String,
courseName: String,
year: Number,
semester: Number,
department: String,
uploadtype: String,
myimage: String,
postedby: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },

/* path: {
 type: String,
 required: true,
 trim: true
 },
 originalname: {
 type: String,
 required: true
 }*/
 
});
 
 
var Material = module.exports = mongoose.model('Material', imageSchema);
 
 module.exports.getImages = function(callback, limit) {
 
 Material.find(callback).limit(limit);
}