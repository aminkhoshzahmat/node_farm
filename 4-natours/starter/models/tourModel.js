const mongoose = require('mongoose'); // Mongo

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A group must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty']
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true, // remove all space around the string > "  this tour... " > "this tour..."
    required: [true, 'A tour must have description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String], // array of strings
  createdAt: {
    type: Date,
    default: Date.now(), // automatically created in creation, no need to send data, gives us timestamp in milliseconds
  },
  startDates: [Date], // Mongo would automatically convert this string "2021-09-12" as a date
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
