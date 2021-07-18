const redis = require("redis")
const express = require('express')
const app = express();

app.use(express.static("./public"))
const router =  express.Router();
router.get("/:id",require("./cache")({
    ttl : 10
}),(req,res) => {
    console.log(req.originalUrl,"没有使用缓存");
    // 从数据库中取出相对应id的新闻数据
    res.send({
        title : "新闻标题" + req.params.id,
        content : "新闻内容" + req.params.id
    })
})
app.use("/api/news",router)
app.listen(9527)
// const {promisify} = require('util') // 把函数变成promise
// const client = redis.createClient({
//     host : "127.0.0.1",
//     port : 6379,
// });



// 通过 client 操作数据库
// 通过方式 和  redis 原生方式基本一致
// client.set("name","wangyizhang",(err,reply)=>{
//     console.log(reply)
// })
// const getAsync = promisify(client.get).bind(client);
// getAsync("name").then(res => {
//     console.log(res)
// })

// client.get("name",(err,reply)=>{
//     console.log(reply)
// })