const mongoose = require('mongoose'); // Mongo
const slugify = require('slugify');
const validator = require('validator');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contains character'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A group must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be about 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        // custom validator
        // this only points to current doc on NEW document creation
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price {{VALUE}} should be below the regular price',
      },
    },
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
      select: false,
    },
    startDates: [Date], // Mongo would automatically convert this string "2021-09-12" as a date
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true }, // when get output as json
    toObject: { virtuals: true }, // when get o
  }
);

/**
 * Virtual property, not persisting in database. just a getter.
 * no arrow function, because we need the `this` to reference to the document.
 * Note: they are not visible by default in outputs, we need to add them as option in schema
 *     {
 *     toJSON: { virtuals: true },
 *   }
 */
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

/**
 * DOCUMENT MIDDLEWARE: point to the object before save.
 * Note: AS this is a middleware, we have access to next, so we should call it.
 * NOTE: runs before .save() and .create() (not insertMany...)
 */
tourSchema.pre('save', function (next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

/**
 * DOCUMENT MIDDLEWARE
 * In post middleware, we don't have access to the `this` anymore, but we have
 * the saved document.
 */
tourSchema.post('save', function (doc, next) {
  // console.log(doc);
  next();
});

/**
 * QUERY MIDDLEWARE
 * Point to the current query, not current document.
 * Everywhere we use find method, it will hook to it, and add this query.
 * Note: but if you use findOne(or findById) it will fetch it, so with regex we can handle that.
 *  findOneAndDelete, findOneAndUpdate
 */
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now(); // custom field we added.
  next();
});

/**
 * QUERY MIDDLEWARE
 * Run after the query executed.
 * We have access to document returned from the query.
 */
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

/**
 * AGGREGATION MIDDLEWARE
 * `this` points to the aggregation object.
 */
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // add match at the beginning of the array.
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
