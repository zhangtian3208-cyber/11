require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

async function connectDB() {
  await client.connect();
  db = client.db("testDB");
  // 设置name字段为唯一索引，禁止重复用户名
  await db.collection("user").createIndex({ name: 1 }, { unique: true });
  console.log("MongoDB数据库连接成功，唯一索引已创建");
}
connectDB();

app.get('/', (req, res) => {
  res.send("后端服务正常，数据库已连通");
});

app.post("/add", async (req, res) => {
  try {
    const data = req.body;
    await db.collection("user").insertOne(data);
    res.json({ code: 200, msg: "新增成功", data });
  } catch (err) {
    res.json({ code: 400, msg: "该姓名已存在，无法重复添加" });
  }
});

app.get("/list", async (req, res) => {
  const list = await db.collection("user").find().toArray();
  res.json({ code: 200, data: list });
});

app.get("/find", async (req, res) => {
  const result = await db.collection("user").findOne(req.query);
  res.json({ code: 200, data: result });
});

app.post("/update", async (req, res) => {
  try {
    const { query, newData } = req.body;
    await db.collection("user").updateOne(query, { $set: newData });
    res.json({ code: 200, msg: "更新成功" });
  } catch (err) {
    res.json({ code: 400, msg: "修改后的姓名已被占用" });
  }
});

app.post("/delete", async (req, res) => {
  await db.collection("user").deleteOne(req.body);
  res.json({ code: 200, msg: "删除成功" });
});

module.exports = app;
