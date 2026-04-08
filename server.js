const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(require("cors")());

app.post("/add-product", (req,res)=>{
  let products = JSON.parse(fs.readFileSync("products.json"));
  products.push(req.body);
  fs.writeFileSync("products.json", JSON.stringify(products));
  res.send("added");
});

app.listen(5000, ()=>console.log("Server running"));
