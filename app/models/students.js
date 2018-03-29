var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var autoIncrement = require('mongoose-auto-increment');
var db = mongoose.connection;

autoIncrement.initialize(db);

var scoresSchema = new Schema({
    score: Number,
    type: String,
})

var StudentSchema = new Schema({
    _id: {type: ObjectId,
        required: true,
        auto: true},
    name: String,
    scores: [scoresSchema],
    // classes: [{type:Schema.Types.ObjectId, ref:'Class'}],
    academic: [{
        class: {type:Schema.Types.ObjectId,ref: 'Class'},
        score: [scoresSchema]
    }],
    studentid: Number,
    email: String,
}, {collection: 'students'})
StudentSchema.plugin(autoIncrement.plugin, { model: 'Student', field: 'studentid' });



//find average
StudentSchema.methods.findClassAverage = function(key, values, rereduce){
}
module.exports = mongoose.model('Student', StudentSchema);

