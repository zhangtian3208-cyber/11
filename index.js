const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// 连接MongoDB数据库，填入你的连接字符串
mongoose.connect("你的MongoDB连接串")
.then(()=>{
    console.log("数据库连接成功");
})
.catch(err=>{
    console.log("数据库连接失败",err);
})

// 用户基础模型（原数据）
const userSchema = new mongoose.Schema({
    name:String,
    age:Number
});
const userCollection = mongoose.model("user",userSchema);

// 新增：祈福、八字、灵签记录模型
const recordSchema = new mongoose.Schema({
    type:String, // bazi八字 / lingqian灵签 / qifu祈福
    content:String,
    time:{type:Date,default:Date.now}
});
const recordCollection = mongoose.model("record",recordSchema);

// 开启跨域，允许Cloudflare Pages前端域名访问
app.all("*",(req,res,next)=>{
    res.header("Access‑Control‑Allow‑Origin","*");
    next();
})

app.use(express.json());

// 原有接口
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"));
})
app.post("/add",async (req,res)=>{
    const {name,age} = req.body;
    const data = new userCollection({name,age});
    await data.save();
    res.send({code:200,msg:"新增成功"});
})
app.get("/list",async (req,res)=>{
    const list = await userCollection.find();
    res.send({code:200,data:list});
})
app.post("/edit",async (req,res)=>{
    const {oldname,name,age} = req.body;
    await userCollection.updateOne({name:oldname},{name,age});
    res.send({code:200,msg:"修改成功"});
})

// 新增接口1：提交记录（八字、祈福、灵签）
app.post("/submitRecord",async (req,res)=>{
    const {type,content} = req.body;
    const data = new recordCollection({type,content});
    await data.save();
    res.send({code:200,msg:"提交成功"});
})

// 新增接口2：获取全部历史记录
app.get("/getRecord",async (req,res)=>{
    const list = await recordCollection.find().sort({time:-1});
    res.send({code:200,data:list});
})

// 新增接口3：灵签随机抽取接口
const signList = ["上上签：万事顺遂","上吉签：福运将至","中签：平稳安康","下签：暂时阻滞"];
app.get("/getSign",(req,res)=>{
    const randomSign = signList[Math.floor(Math.random()*signList.length)];
    res.send({code:200,data:randomSign});
})

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("服务启动");
})
