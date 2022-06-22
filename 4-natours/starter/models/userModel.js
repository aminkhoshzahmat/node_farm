const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // built-in nodejs

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true, // converto to lowwer case
    validate: [validator.isEmail, 'Please provid a valid email'], // we can write our custom validator, but also we can use validator package.
  },
  photo: String, // not required, just a string
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false, // don't fetch it in query responses
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    // This only works on CREATE and SAVE
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  // Only run this function if passowrd was actually modified
  if (!this.isModified('password')) return next();

  // salt is cpu intensive > 12, and this is async func, which returns promise, then we need to await
  this.password = await bcrypt.hash(this.password, 10);

  // we said it should be required, but not in database!
  // So this way we delete the passwordConfirm field from the collection
  this.passwordConfirm = undefined;
  next();
});

/**
 * Instance method, available in all documents in certain collection
 * check password equality
 */
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  // this.password // will not be available due to select: false
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * JWT timestamp is in seconds, but passwordChangedAt is date time,getTime gets the milisecons we should divid it by 1000;
 */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // `this` points to the schema object here
  if (this.passwordChangedAt) {
    const changedTimestamp = +this.passwordChangedAt.getTime() / 1000; // convert date to miliseconds
    return JWTTimestamp < changedTimestamp;
  }

  // means not changed
  return false;
};

/**
 * Even reset token should be encrypted! Because it's like plain password
 */
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // valid for 10min
  console.log({ resetToken });
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
