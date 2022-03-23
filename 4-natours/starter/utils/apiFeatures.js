class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString }; // shallow copy
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // localhost:3000/api/v1/tours?duration[gte]=5&difficulty=easy&page=1
    // { duration: { gte: '5' }, difficulty: 'easy', page: '1' }
    // { difficulty: 'easy', duration: {$gte: 5} }
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy); // sort=price | sort=-price
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1; // * 1 convert to ing, | default value
    const limit = this.queryString.limit * 1 || 100; // perPage
    const skip = (page - 1) * limit; // limit
    //   const numTours = Tour.countDocuments(); // return total records
    //   if (skip >= numTours) throw new Error("This page doesn't exists"); // show in > res.status(404).json
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
