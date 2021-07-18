const express = require('express')
const session = require("express-session")
const redis = require('redis');
const RedisStore = require('connect-redis')(session)
const redisClient = redis.createClient();
const app = express();

app.use(
    session({
        store : new RedisStore({client : redisClient}),
        secret : "wangyizhang",
        resave : false,
        saveUninitialized : false
    })
)
app.get("/a",(req,res)=>{
    if(!req.session.a){
    req.session.a = 1;
    req.session.b = 2;
    req.session.rad = Math.random();
    }
    res.send("session已经存储了")
})
app.get("/b",(req,res)=>{
    res.send(req.session)
})
app.listen(9527)
