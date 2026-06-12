const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// 连接MongoDB，替换成你自己的数据库连接字符串
mongoose.connect("你的MongoDB连接串")
.then(()=>{
    console.log("数据库连接成功");
})
.catch(err=>{
    console.log("数据库连接失败",err);
})

// 定义用户模型
const userSchema = new mongoose.Schema({
    name:String,
    age:Number
});
const userCollection = mongoose.model("user",userSchema);

// 取消唯一索引，注释掉这一行：userCollection.createIndex({name:1},{unique:true})

app.use(express.json());
// 托管前端页面
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"));
})

// 新增数据接口
app.post("/add",async (req,res)=>{
    const {name,age} = req.body;
    const data = new userCollection({name,age});
    await data.save();
    res.send({code:200,msg:"新增成功"});
})

// 获取全部数据
app.get("/list",async (req,res)=>{
    const list = await userCollection.find();
    res.send({code:200,data:list});
})

// 修改数据接口
app.post("/edit",async (req,res)=>{
    const {oldname,name,age} = req.body;
    await userCollection.updateOne({name:oldname},{name,age});
    res.send({code:200,msg:"修改成功"});
})

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("服务启动");
})
