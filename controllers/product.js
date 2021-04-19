const Product = require("../models/product");
const User = require("../models/user");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    console.log(req.body);
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (err) {
    console.log(err);
    // res.status(400).send("Product Creation Failed");

    res.status(400).json({
      err: err.message,
    });
  }
};

exports.listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("subcategories")
    .sort([["createdAt", "desc"]])
    .exec();
  res.json(products);
};

exports.remove = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deletedProduct);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Product delete failed!");
  }
};

exports.read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("subcategories")
    .exec();
  res.json(product);
};

exports.update = async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      {
        slug: req.params.slug,
      },
      req.body,
      { new: true } //To send the recently updated product as the response
    );
    res.json(updatedProduct);
  } catch (err) {
    console.log("PRODUCT UPDATE ERROR", err);

    res.status(400).json({
      err: err.message,
    });
  }
};

//WITHOUT PAGINATION
// exports.list = async (req, res) => {
//   try {
//     //CreatedAt/UpdatedAt, desc/asc, Number
//     const { sort, order, limit } = req.body;
//     const products = await Product.find({})
//       .populate("Category")
//       .populate("Subcategories")
//       .sort([[sort], [order]])
//       .limit(limit)
//       .exec();

//     res.json(products);
//   } catch (err) {
//     console.log(err);
//   }
// };

//WITH PAGINATION
exports.list = async (req, res) => {
  try {
    //CreatedAt/UpdatedAt, desc/asc, Number
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const perPage = 3;

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("Category")
      .populate("Subcategories")
      .sort([[sort], [order]])
      .limit(perPage)
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

exports.productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total);
};

exports.productStar = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const user = await User.findOne({ email: req.user.email }).exec();
  const { star } = req.body;

  //Who is updating
  //Check if currently logged in user have already addded rating to this product
  let existingRatingObject = product.ratings.find(
    (r) => r.postedBy.toString() === user._id.toString()
  );

  //If user hasn't left rating yet, push it
  if (existingRatingObject === undefined) {
    let ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { ratings: { star: star, postedBy: user._id } },
      },
      { new: true }
    ).exec();
    console.log("ratingAdded :", ratingAdded);
  } else {
    //If user has a rating already, update it
    const updatedRating = await Product.updateOne(
      {
        ratings: { $elemMatch: existingRatingObject },
      },
      { $set: { "ratings.$.star": star } },
      { new: true }
    ).exec();

    console.log("ratingUpdated", updatedRating);
    res.json(updatedRating);
  }
};

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("subcategories")
    .populate("postedBy")
    .exec();

  res.json(related);
};

//Search Filter
const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("Category", "_id name")
    .populate("subcategories", "_id name")
    .exec();

  res.json(products);
};

const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate("Category", "_id name")
      .populate("subcategories", "_id name")
      .exec();
      res.json(products); 
  } catch (err) {
    console.log(err);
  }
 
};

const handleCategory = async(req, res, category) => {
try {
  let products = await Product.find({ category })
    .populate("Category", "_id name")
    .populate("subcategories", "_id name")
    .exec();
  res.json(products); 
}catch(err){
  console.log(err)
}
}

exports.searchFilters = async (req, res) => {
  const { query, price, category } = req.body;

  if (query) {
    console.log("Query", query);
    await handleQuery(req, res, query);
  }

  //Price is in array(Between two values) eg[0,10000]
  if (price !== undefined) {
    console.log("Price", price);
    await handlePrice(req, res, price);
  }

  if(category) {
    console.log("Category", category);
    await handleCategory(req, res, category)
  }
};
