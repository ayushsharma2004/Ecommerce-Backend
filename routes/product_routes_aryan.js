import express from "express"
import { 
    checkcache_allproduct, 
    checkcache_for_product, 
    checkcache_for_bestseller,
    checkcache_for_toprated 
} from "../middleware/caching_middleware.js"
import { 
    get_all_product_paginate, 
    get_product_by_pid, 
    get_bestseller,
    get_toprated    
} from "../controllers/product_controller_user.js"

const router = express.Router()

//route for getting all the products
router.get("/get_product",checkcache_allproduct, get_all_product_paginate)

//route for getting a particular product
router.get("/get_product_pid", checkcache_for_product, get_product_by_pid)

router.get("/get_bestseller", checkcache_for_bestseller, get_bestseller)

router.get("/get_toprated", checkcache_for_toprated, get_toprated)
export default router