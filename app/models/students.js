var mongoose = require('mongoose');
var $q = require('q');
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
    academic: [{
        class: {type:Schema.Types.ObjectId,ref: 'Class'},
        score: [scoresSchema]
    }],
    studentid: Number,
    email: String,
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
}, {collection: 'students'})
StudentSchema.plugin(autoIncrement.plugin, { model: 'Student', field: 'studentid' });

StudentSchema.method('finalGrade', function () {
   // SET FINAL GRADE
            var deferred = $q.defer();
            let courseID;
               let hm=[];
               let qz=[];
               let md=[];
               let fn=[];
               let hmGrade;
               let qzGrade;
               let mdGrade;
               let fnGrade;
                let statement=[];
               let loopScores = function(stObj, callback){
                   if(stObj.academic.length > 0 ){
                       for( var c= 0; c < stObj.academic.length; c++ ){
                            courseID = stObj.academic[c].class.classCode;
                            for(let i = 0; i < stObj.academic[c].score.length; i++){
                                if(stObj.academic[c].score[i].type == 'hw'){
                                    hm.push(stObj.academic[c].score[i].score)
                                } else if(stObj.academic[c].score[i].type == 'qz'){
                                    qz.push(stObj.academic[c].score[i].score)
                                } else if (stObj.academic[c].score[i].type == 'md'){
                                    md.push(stObj.academic[c].score[i].score)
                                } else if (stObj.academic[c].score[i].type == 'fn'){
                                    fn.push(stObj.academic[c].score[i].score)
                                } else if( i == stObj.academic[c].score.length){
                                break;  
                                }
                            };
                            card = {name: stObj.name, courseID: courseID, final: callback()}
                            statement.push(card);
                        }
                        deferred.resolve(statement)

                   }
                   
               }
               let calcFinal = function(){
                   function getSum(total, num) {
                       return total + num;
                   }
                   hmGrade = hm.reduce(getSum);
                   qzGrade = qz.reduce(getSum);
                   mdGrade = md.reduce(getSum);
                   fnGrade = fn.reduce(getSum);
                   finalGrade = (hmGrade/hm.length) + (qzGrade/qz.length) + (mdGrade/md.length) + (fnGrade/fn.length);
                    return finalGrade;
                }
                var score = loopScores(this, calcFinal)
               return deferred.promise;
  })


StudentSchema.methods.findClassAverage = function(key, values, rereduce){
}
module.exports = mongoose.model('Student', StudentSchema);

