const Product = require("../models/product");
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
    return res.status(400).send("Product update failed!");
  }
};
