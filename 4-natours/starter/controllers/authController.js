const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, passwordChangedAt } = req.body;
  const newUser = await User.create({
    name: name,
    email: email,
    password: password,
    passwordConfirm: passwordConfirm,
    passwordChangedAt: passwordChangedAt,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'sucees',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // const email = req.body.email
  const { email, password } = req.body;
  // 1) check if email and password exist
  if (!email || !password) {
    // we return because we want to make sure login function finish here right away
    // unless you will get this error " Cannot set headers after they are sent to the client" you can't send two headers
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) check if user exitst and password is correct
  // property and value are the same name, in es6 we can abr that.a
  const user = await User.findOne({ email }).select('+password'); // explicity select password in result
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) if everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'succes',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) check if token exists
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please login to get access', 401));
  }

  // 2) verify the token, if it verifies then we call the callback function (in third parameter)
  // Synchronously verify given token using a secret or a public key to get a decoded token
  // we need to promisifing it. to return a promise, node as built in function for it.
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  /**
   * id of the user,                  issued at timestamp, expiration timestamp
   * { id: '62b038960d50dee1499c88d1', iat: 1655723531, exp: 1655809531 }
   */
  // console.log(decoded);

  // 3) check if user still exists
  //      - what if the user is deleted in meantime!?
  //      - what if the user changed the password!?
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }
  // console.log(decoded.iat);

  // 4) chekf if changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please login again', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser;
  next();
});
