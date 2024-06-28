import express from "express"

const app = express()

var count = 1

app.get("/", (req, res)=>{
    count++
    res.send(JSON.stringify(count))
})
app.listen(3000, ()=>{
    console.log("server is running on 3000 port")
})