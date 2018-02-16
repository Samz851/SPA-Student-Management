var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator');
const bcrypt = require('bcrypt-nodejs');

//mongoDB Validators - Backend
var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z]+$/,
        message: 'Name should only contain letters',
    })
]

var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 15],
        message: 'Username must be between {ARGS[0]} and {ARGS[1]}',
    }),
    validate({
        validator: 'isAlphanumeric',
        message: 'Username must contain numbers and letters only',
    })
]

var emailValidator = [
    validate({
      validator: 'isLength',
      arguments: [6, 50],
      message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters long',
    }),
    validate({
      validator: 'isEmail',
      passIfEmpty: true,
      message: 'This is not a valid email',
    })
]

  var passwordValidator = [
      validate({
          validator: 'isLength',
          arguments: [6, 24],
          message: 'Password must be between {ARGS[0]} and {ARGS[1]} characters long',
      }),
      validate({
          validator:'matches',
          arguments:/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{1,}$/,
          message: 'Password must contain atleast one letter, one number, and one symbol'
      })
]

    var UserSchema = new Schema({
        firstname: {type: String,
            required: true,
            validate: nameValidator}, 
        lastname: {type: String,
            required: true,
            validate: nameValidator},
        username: {type: String,
            lowercase: true,
            required: true,
            validate: usernameValidator,
            unique: true},
        password: {type: String,
            required: true,
            validate: passwordValidator},
        email: {type: String,
            required: true,
            lowercase: true,
            unique:true,
            validate: emailValidator},
        isverified: {type: Boolean,
                    required: true,
                    default:false},
        temptoken: {type: String},
    });

  UserSchema.pre('save', function(next){
      // do stuff
      let user = this;
      bcrypt.hash(user.password, null, null, function(err, hash){
          if(err) return next(err);
          user.password = hash;
          next();
      });
  })

  UserSchema.methods.passwordMatch = function(givenPassword){
      
      return bcrypt.compareSync(givenPassword, this.password);
  }

  module.exports = mongoose.model('User', UserSchema);