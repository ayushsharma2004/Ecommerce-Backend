import express from "express"
import multer from "multer"
import { upload_banner, get_all_banner, } from "../controllers/banner_controller.js"
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js"

const upload = multer({storage: multer.memoryStorage()})

const router = express.Router()

router.post("/new_banner", upload.single('file'), requireSignIn, isAdmin, upload_banner )

router.get("/get_all_banner", get_all_banner)

export default router