var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var classSchema = new Schema({
    _id: {type: ObjectId,
        required: true,
        auto: true},
    className: String,
    classCode: String,
    classDesc: String,
    classStart: Date,
    classDuration: Number,
    classInstructor: {type:Schema.Types.ObjectId, ref:'User'},
    enrolled: [{type:Schema.Types.ObjectId, ref:'Student'}]
})
module.exports = mongoose.model('Class', classSchema);