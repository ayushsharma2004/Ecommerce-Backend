import { db, admin } from "../DB/firestore.js";
import dotenv from "dotenv"
import {FieldValue} from "firebase-admin/firestore"

dotenv.config()

const bucket = admin.storage().bucket()

async function get_user_details(req, res) {
    if (!req.body.phonenumber) {
        return res.status(400).send("phone number is not provided")
    }
    else {
        const doc = await db.collection(process.env.userCollection).doc(req.query.phonenumber).get()
        res.status(200).send(doc.data())
    }
}

async function update_user_details(req, res) {
    console.log("inside update user", req.user_id)
    if (req.user_id) {
        try {
            let photoUrl = ""
            const { name, address } = req.body
            console.log(name, address)
            if (req.file) {
                if (req.file.mimetype == "image/jpeg" || req.file.mimetype == "image/jpg" || req.file.mimetype == "image/png") {
                    const blob = bucket.file(`users/${req.user_id}`)
                    const blobStream = blob.createWriteStream()

                    blobStream.on("error", (err) => {
                        console.error("Upload error:", err);
                        res.status(500).send({ error: "Upload error" });
                    })

                    blobStream.on("finish", async () => {
                        await blob.makePublic()
                        photoUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
                        if (name && address) {
                            await db.collection(process.env.userCollection).doc(req.user_id).update({ name: name, address: address, photoUrl: photoUrl })
                            return res.status(200).send("name address and profile pic updated")
                        }
                        else if(name){
                            await db.collection(process.env.userCollection).doc(req.user_id).update({ name: name, photoUrl: photoUrl })
                            return res.status(200).send("name and profile pic updated")
                        }
                        else if(address){
                            await db.collection(process.env.userCollection).doc(req.user_id).update({ address: address, photoUrl: photoUrl })
                            return res.status(200).send(" address and profile pic updated")
                        }
                        else{
                            await db.collection(process.env.userCollection).doc(req.user_id).update({photoUrl: photoUrl })
                            return res.status(200).send("profile pic updated")
                        }
                    })

                    blobStream.end(req.file.buffer)
                }
                else {
                    res.status(400).send("file type not supported")
                    req.file.buffer = null
                }
            }
            else if(name&&address){
                await db.collection(process.env.userCollection).doc(req.user_id).update({ name: name, address:address })
                return res.status(200).send("name and address updated")
            }
            else if(name){
                await db.collection(process.env.userCollection).doc(req.user_id).update({ name: name })
                return res.status(200).send("name updated")
            }
            else if(address){
                await db.collection(process.env.userCollection).doc(req.user_id).update({ address:address })
                return res.status(200).send("address updated")
            }
            else{
                res.status(400).send("Nothing to update")
            }
        }
        catch (err) {
            console.log("error")
        }
    }
    else{
        res.status(401).send("unauthorized")
    }
}

async function add_to_wishlist(req, res){
    console.log("inside wishlist", req.body.user_id)
    console.log(req.body.pid)
    if(req.body.user_id){
        try{
            await db.collection(process.env.userCollection).doc(req.body.user_id).update({ wishlist : FieldValue.arrayUnion(req.body.pid)})
            res.status(200).send("item added successfully")
        }
        catch(err){
            console.log("error occured")
            console.error(err)
            res.status(500).send("some error occured")
        }
    }
    else{
        res.status(401).send("not signed in")
    }
}

async function add_to_cart(req, res){
    console.log("inside cart", req.body.user_id)
    console.log(req.body.pid)
    if(req.body.user_id){
        try{
            await db.collection(process.env).doc(req.user_id).update({ cart : FieldValue.arrayUnion(req.body.pid)})
            res.status(200).send("item added successfully")
        }
        catch(err){
            console.log("error occured")
            res.status(500).send("some error occured")
        }
    }
    else{
        res.status(401).send("not signed in")
    }
}
export { get_user_details, update_user_details, add_to_cart, add_to_wishlist }