var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scoresSchema = new Schema({
    score: Number,
    type: String,
})

var StudentSchema = new Schema({
    name: String,
    scores: [scoresSchema],
    supervisor: String
}, {collection: 'students'})

//find average
StudentSchema.methods.findClassAverage = function(key, values, rereduce){
}
module.exports = mongoose.model('Student', StudentSchema);