import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Product from "../models/product.model.js";

export const createProduct = asyncHandler(async (req, res) => {
  const imageLocalUrl = req.file?.path;

  if (!imageLocalUrl) {
    throw new ApiError(400, "Product image is required");
  }

  const productImage = await uploadOnCloudinary(imageLocalUrl);

  if (!productImage) {
    throw new ApiError(400, "Failed to upload on cloudinary");
  }

  const { name, description, type, price, date } = req.body;

  if (!name || !description || !type || !price || !date) {
    throw new ApiError(400, "All fields are required");
  }

  const product = await Product.create({
    name,
    description,
    type,
    price,
    date,
    image: productImage.url,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "product added successfully", product));
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.name) {
    filter.name = { $regex: req.query.name, $options: "i" };
  }

  if (req.query.type) {
    filter.type = { $regex: req.query.type, $options: "i" };
  }

  const products = await Product.find(filter);

  const message =
    products.length === 0
      ? "No products found"
      : "Products fetched successfully";

  return res.status(200).json(new ApiResponse(200, message, products));
});

export const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "no product found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "product added successfully", product));
});

export const findbyName = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ name: req.params.name });

  if (!product) {
    throw new ApiError(404, "no product found with this name");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "product found successfully", product));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, type, price, date } = req.body;

  if (!name || !description || !type || !price || !date) {
    throw new ApiError(400, "All fields are required");
  }

  const updates = { name, description, type, price, date };

  if (req.file?.path) {
    productImage = await uploadOnCloudinary(req.file?.path);

    if (!productImage) {
      throw new ApiError(400, "faild to upload new product image");
    }

    updates.image = productImage.url;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "product updated successfully", updatedProduct));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new ApiError(404, "no product found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "product delete successfully", product));
});
