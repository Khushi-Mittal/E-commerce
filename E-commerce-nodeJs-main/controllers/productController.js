const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const path = require('path');

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};


const getAllProducts = async (req, res) => {

    let products = Product.find({});
    let total = Product.find({})
    if(req.query._sort && req.query._order)
        products =  products.sort({[req.query._sort]:req.query._order})

    const companies = req.query.company;
    const categories = req.query.category;

    // if (companies) {
    //   productsQuery = products.where('company').in(companies);
    //   totalQuery = total.where('company').in(companies);
    // }
    // if (categories) {
    //   productsQuery = products.where('categories').in(categories);
    //   totalQuery = total.where('categories').in(categories);
    // }
    if(req.query.category)
    {
        products =  products.find({category:req.query.category})
        total = total.find({category:req.query.category})
    }

    if(req.query.company)
    {
        products =  products.find({company:req.query.company})
        total = total.find({company:req.query.company})
    }
    if(req.query._page && req.query._limit)
    {
        const pageSize = +req.query._limit;
        const page = +req.query._page
        products = products.skip(pageSize*(page-1)).limit(pageSize);
    }
    products = await products.exec();
    total = await total.exec();
  res.status(StatusCodes.OK).json({ products, count: total.length });
};


const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId }).populate('reviews');

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};
const updateProduct = async (req, res) => {
  const {id: productId } = req.params;

 console.log(productId)
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });

  console.log(product)
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { _id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  await product.remove();
  res.status(StatusCodes.OK).json({ msg: 'Success! Product removed.' });
};
const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded');
  }
  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please Upload Image');
  }

  const maxSize = 1024 * 1024;

  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      'Please upload image smaller than 1MB'
    );
  }

  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
