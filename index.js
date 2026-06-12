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
  console.log("MongoDB数据库连接成功");
}
connectDB();

app.get('/', (req, res) => {
  res.send("后端服务正常，数据库已连通");
});

app.post("/add", async (req, res) => {
  const data = req.body;
  await db.collection("user").insertOne(data);
  res.json({ code: 200, msg: "新增成功", data });
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
  const { query, newData } = req.body;
  await db.collection("user").updateOne(query, { $set: newData });
  res.json({ code: 200, msg: "更新成功" });
});

app.post("/delete", async (req, res) => {
  await db.collection("user").deleteOne(req.body);
  res.json({ code: 200, msg: "删除成功" });
});

module.exports = app;
