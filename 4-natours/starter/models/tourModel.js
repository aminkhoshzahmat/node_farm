const mongoose = require('mongoose'); // Mongo
const slugify = require('slugify');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
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
      select: false,
    },
    startDates: [Date], // Mongo would automatically convert this string "2021-09-12" as a date
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
 * Document middleware: lifecycles
 * Note: `this` refers to the object before save.
 * Note: AS this is a middleware, we have access to next, so we should call it.
 * NOTE: runs before .save() and .create() (not insertMany...)
 */
tourSchema.pre('save', function (next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

/**
 * In post middleware, we don't have access to the `this` anymore, but we have
 * the document saved.
 */
tourSchema.post('save', function (doc, next) {
  // console.log(doc);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
