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
    // classes: [{type:Schema.Types.ObjectId, ref:'Class'}],
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

// Virtuals


//find average
StudentSchema.method('finalGrade', function () {
   // SET FINAL GRADE
            var deferred = $q.defer();
               let hm=[];
               let qz=[];
               let md=[];
               let fn=[];
               let hmGrade;
               let qzGrade;
               let mdGrade;
               let fnGrade;
               let calcFinalGrade;
               let loopScores = function(stObj, callback){
                   for(let i = 0; i < stObj.academic[0].score.length; i++){
                       if(stObj.academic[0].score[i].type == 'hw'){
                           hm.push(stObj.academic[0].score[i].score)
                       } else if(stObj.academic[0].score[i].type == 'qz'){
                           qz.push(stObj.academic[0].score[i].score)
                       } else if (stObj.academic[0].score[i].type == 'md'){
                           md.push(stObj.academic[0].score[i].score)
                       } else if (stObj.academic[0].score[i].type == 'fn'){
                           fn.push(stObj.academic[0].score[i].score)
                       }
                       if( i == stObj.academic[0].score.length){
                         break;  
                       }
                   };
                   callback();
                   deferred.resolve(callback())
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
                   console.log('final: ' +finalGrade );
                    return calcFinalGrade = finalGrade;
                }
                var score = loopScores(this, calcFinal)
                console.log(score)
               
               //END
            //    deferred.resolve(score);
               return deferred.promise;
  })


StudentSchema.methods.findClassAverage = function(key, values, rereduce){
}
module.exports = mongoose.model('Student', StudentSchema);

