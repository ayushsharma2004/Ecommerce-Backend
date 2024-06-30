import express from "express"
import { get_user_details, update_user_details, add_to_cart, add_to_wishlist } from "../controllers/userController.js"
import { isUser, requireSignIn } from "../middleware/authMiddleware.js"
import multer from "multer"

const Upload = multer({storage: multer.memoryStorage()})

const router = express.Router()

router.get("/get_user_details",requireSignIn, isUser, get_user_details)

router.post("/update_user", requireSignIn, update_user_details)

router.post("/update_cart", add_to_cart)

router.post("/update_wishlist", add_to_wishlist)
export default router