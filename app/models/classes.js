var mongoose = require('mongoose');
var Schema = mongoose.schema;

var classSchema = new Schema({
    classID : Schema.Types.ObjectId,
    className: String,
    classDesc: String,
    classStart: Date,
    classDuration: Number,
    enrolled: [{type:Schema.Types.ObjectId, ref:'Student'}]
})
module.exports = mongoose.model('Class', classSchema);