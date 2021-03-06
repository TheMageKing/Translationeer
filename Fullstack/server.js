const request = require("request");
const cheerio = require("cheerio");
const express = require("express");
const path = require("path");
const translateapi = require("./translateapi.js");
require("dotenv").config();

console.log(process.env.FIREBASE_API_KEY);

const app = express();

//USES ALL THE API ENDPOINTS FOR TRANSLATION
app.use("/translateapi", translateapi);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});

//"heroku-postbuild": "cd client && npm install && npm run build"
