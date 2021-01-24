require("dotenv").config();
const express = require("express");
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
  try {
    const shortUrls = await ShortUrl.find();
    res.render("index", { shortUrls: shortUrls });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});

app.get("/:shortUrl", async (req, res) => {
  try {
    const shortUrl = await ShortUrl.findOne({ shortUrl: req.params.shortUrl });
    if (shortUrl == null) return res.sendStatus(400);
    shortUrl.clicks++;
    shortUrl.save();
    res.redirect(shortUrl.fullUrl);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});

app.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await ShortUrl.findByIdAndDelete(id);
    if (response == null) return res.sendStatus(400);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});

app.post("/shortUrl", async (req, res) => {
  try {
    await ShortUrl.create({
      fullUrl: req.body.fullUrl,
    });
    res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server up and running on port ${port}`);
});
