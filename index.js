require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectDB() {
  await client.connect();
  console.log("MongoDB数据库连接成功");
}
connectDB().catch(console.error);

app.get('/', (req, res) => {
  res.send("后端服务正常，数据库已连通");
});

module.exports = app;
