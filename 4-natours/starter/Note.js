/**
 * JSend specification for sending data.
 * JSOPN:API
 * OData JSON Protocol
 *
 * Enveloping means, wrapping object ino another object like data.
 *
 * ESLINT is all about coding rules.
 * https://eslint.org/docs/rules/
 * files with error will get red.
 * npm i eslint prettier eslint-config-prettier eslint-plugin-prettier  eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev
 *
 * ========================================
 * MongoDB
 *  Maximum size for each document is currently 16MB
 * Each documents contains unique id which acts as primary key of that document.
 * We have collections, and each collection has documents.
 *
 *  - use new_database > if doesn't exist, create new one
 *  - db > is the current active database.
 *      MongoDB uses BSON,we can simply pass a JS Object into it, and it will convert it to JSON and BSON
 *      We can quote property name, but it's optional
 *      Everything works with object in mongodb, even filters.
 *      $ in mongodb is the sign of operator, like $lte > means that less than equal.
 *      projection, means only select some fields to show in output.
 *      > each document can be different to others
 *      > db
 *      > show dbs
 *      > show collections
 *      > quit()
 *    --------------------------
 *  - Insert
 *      > db.tours.insertOne({})
 *          db.tours.insertOne({name: 'The Forest Hiker', price: 297, rating: 4.7})
 *      > db.tours.insertMany([{}, {}])
 *          db.tours.insertMany([{name: "The Sea Explorer", price: 497, rating: 4.8}, {name: "The Snow Adventurer", price: 997, rating: 4.9, difficulty: "easy"}])
 *  - Read
 *      > db.tours.find() // select all
 *      > db.tours.find({name: "The Forest Hiker"}) // filter, like where but case sensitive
 *      > db.tours.find({name: "The Forest Hiker"}) // filter, comparison
 *      > db.tours.find({price: {$lte: 500}}) // filter, comparison
 *      > db.tours.find({price: {$lte: 500}, rating: {$gte: 4.8}}) // multiple AND filter
 *      > db.tours.find({ $or: [ {price: {$lt: 500}}, {rating: {$gte: 4.8}} ] }) // multiple OR filter, $or accepts array of conditions (object for each condition)
 *      > db.tours.find({ $or: [ {price: {$gt: 500}}, {rating: {$gte: 4.8}} ] } , {name: 1}) // Projection, select name from tours where...
 *  - Update (partially)
 *      > db.tours.updateOne({name: "The Snow Adventure"}, {$set: {price: 597}}) // if it finds many, it only update first one because of updateOne, and it's exact match
 *      > db.tours.updateMany({ price: {$gt: 500}, rating: {$gte: 4.8} }, {$set: {premium: true}}) // update, add new field to document.
 *  - Replace
 *      > db.tours.replace... (see the documentation)
 *  - Delete
 *      > db.tours.deleteMany({}) // delete all
 *      >db.tours.deleteMany({ rating: {$lt: 4.8} }) // delete with condition
 */
