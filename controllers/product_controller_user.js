import { db } from "../DB/firestore.js"
import dotenv from 'dotenv'
import cache from "memory-cache"

const CACHE_DURATION = 10 * 60 * 1000 //10 minutes

dotenv.config()

async function get_all_product_paginate(req, res) {
    var last_id = undefined
    const product_arr = []
    console.log("request url", req.url)
    const request_query = req.query
    const page_no = request_query.page_no
    const page_size = request_query.pagesize
    last_id = request_query.last_id
    const key = req.url + page_no

    if (!page_size || !page_no) {
        res.status(400).send("pagesize and pageno are required")
    }
    else {
        console.log("last_doc id is", request_query.last_id)
        
        let query = db.collection(process.env.collectionProduct)
            .orderBy('price')
            .limit(Number(page_size));

        if (last_id) {
            console.log("id of last doc", last_id)
            const last_doc = await db.collection(process.env.collectionProduct).doc(last_id).get()
            query = query.startAfter(last_doc)
        }

        const snapshot = await query.get()

        if (snapshot.empty) {
            console.log("data is not present")
            res.status(404).send("No more data")
        }
        else {
            // last = snapshot.docs[snapshot.docs.length - 1]
            snapshot.forEach(doc => {
                var act_data = doc.data()
                const product_summary = {
                    pid: act_data.pid,
                    name: act_data.name,
                    imgurl: act_data.image,
                    rating: act_data.rating,
                    price: act_data.price,
                    description: act_data.description,
                    category: act_data.category
                }
                product_arr.push(product_summary)
            })
            console.log("product_data", product_arr)
            let cacheddata = cache.get(key)
            if (cacheddata) {
                console.log("data is present in cache from get_all_product_paginate", key)
            }
            else {
                console.log("setting data in cache")
                cache.put(key, product_arr, CACHE_DURATION)
            }

            res.status(200).send(product_arr)
        }
    }

}

async function get_product_by_pid(req, res){
    // console.log(req.query.pid)
    if(req.query.pid){
        const key = req.query.pid
        const product_doc = await db.collection(process.env.collectionProduct).doc(req.query.pid).get()
        res.status(200).send(product_doc.data())
        cache.put(key, product_doc.data(), CACHE_DURATION)
    }
    else{
        res.status(400).send("PID should be given")
    }
}

async function get_bestseller(req, res){
    let bestseller_products = []
    let query = db.collection(process.env.collectionProduct).orderBy('order_count').limit(20)
    
    const key = "bestseller"

    const snapshot = await query.get()
    snapshot.forEach(doc => {
        var act_data = doc.data()
        const product_summary = {
            pid: act_data.pid,
            name: act_data.name,
            imgurl: act_data.image,
            rating: act_data.rating,
            price: act_data.price,
            description: act_data.description,
            category: act_data.category
        }
        bestseller_products.push(product_summary)
    })

    cache.put(key, bestseller_products, CACHE_DURATION)

    res.status(200).send(bestseller_products)
}

async function get_toprated(req, res){
    let top_rated = []
    let query = db.collection(process.env.collectionProduct).orderBy('rating_average').limit(20)
    
    const key = "toprated"

    const snapshot = await query.get()
    snapshot.forEach(doc => {
        var act_data = doc.data()
        const product_summary = {
            pid: act_data.pid,
            name: act_data.name,
            imgurl: act_data.image,
            rating: act_data.rating,
            price: act_data.price,
            description: act_data.description,
            category: act_data.category
        }
        top_rated.push(product_summary)
    })

    cache.put(key, top_rated, CACHE_DURATION)

    res.status(200).send(top_rated)
}

export { get_all_product_paginate, get_product_by_pid, get_bestseller, get_toprated }