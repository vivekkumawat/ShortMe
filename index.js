const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const ShortUrl = require("./models/ShortUrl");
const app = express();

// Connecte to DB
mongoose.connect(
  process.env.DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error) => {
    if (error) {
      console.log("Unable to connect to DB " + error);
    }
    console.log("Connected to DB Successfully");
  }
);

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ shortUrl: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(400);
  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.fullUrl);
});

app.post("/shortUrl", async (req, res) => {
  await ShortUrl.create({
    fullUrl: req.body.fullUrl,
  });
  res.redirect("/");
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server up and running on port ${port}`);
});
