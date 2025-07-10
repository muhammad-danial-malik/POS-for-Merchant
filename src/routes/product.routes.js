import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  findbyName,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(upload.single("image"), createProduct);
router.route("/").get(getAllProducts);
router.route("/:id").get(upload.single("image"), getSingleProduct);
router.route("/:id").patch(updateProduct);
router.route("/:id").delete(deleteProduct);
router.route("/:name").get(findbyName);

export default router;
