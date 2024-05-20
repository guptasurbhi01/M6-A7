const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

const urlDatabase = {};

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/shorten", async (req, res) => {
  const { nanoid } = await import("nanoid");
  const longUrl = req.body.longUrl;

  if (!isValidUrl(longUrl)) {
    return res.status(400).send("Invalid URL");
  }

  const shortUrl = nanoid(8); 
  urlDatabase[shortUrl] = longUrl;

  res.send(`Shortened URL: http://localhost:${PORT}/${shortUrl}`);
});

app.get("/:shortUrl", (req, res) => {
  const shortUrl = req.params.shortUrl;
  const longUrl = urlDatabase[shortUrl];

  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).send("URL not found");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
