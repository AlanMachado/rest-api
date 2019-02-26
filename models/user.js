var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
    firstName: {
        required: true,
        type: String,
        trim: true
    },
    lastName: {
        required: true,
        type: String,
        trim: true
    },
    emailAddress: {
        required: true,
        type: String,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.statics.authenticate = function(email, password, callback) {
    User.findOne({emailAddress: email}).exec(function (error, user) {
        if (error) {
            return callback(error);
        } else if ( !user ) {
            var err = new Error('User not found.');
            err.status = 401;
            return callback(err);
        }
        bcrypt.compare(password, user.password , function(error, result) {
            if (result === true) {
                return callback(null, user);
            } else {
                return callback();
            }
        });
    });
}

// hash password before saving to database
UserSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
});



var User = mongoose.model('users', UserSchema);
module.exports = User;