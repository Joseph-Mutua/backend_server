const SubCategory = require("../models/subcategory");
const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const subcategory = await new SubCategory({
      name,
      parent,
      slug: slugify(name).toLowerCase(),
    }).save();
    res.json(subcategory);
  } catch (err) {
    console.log("SUB CATEGORY CREATE ERROR", err.message);
    res.status(400).send("Create subcategory failed");
  }
};

exports.list = async (req, res) => {
  res.json(await SubCategory.find({}).sort({ createdAt: -1 }).exec());
  //
};

exports.read = async (req, res) => {
  let subcategory = await SubCategory.findOne({ slug: req.params.slug }).exec();

  const products = await Product.find({ subcategories: subcategory }).exec();

  res.json({ subcategory, products });
  //
};

exports.update = async (req, res) => {
  const { name } = req.body;

  try {
    const updated = await SubCategory.findOneAndUpdate(
      { slug: req.params.slug },
      { name, parent, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(400).send("SubCategory update failed!");
  }
  //
};

exports.remove = async (req, res) => {
  try {
    const deleted = await SubCategory.findOneAndDelete({
      slug: req.params.slug,
    });
    res.json(deleted);
  } catch (err) {
    console.log(err);
    res.status(400).send("SubCategory delete failed!");
  }
};
