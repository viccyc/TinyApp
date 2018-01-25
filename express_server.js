var express = require("express");
var app = express();
// default port 8080
var PORT = process.env.PORT || 8080;
const urlDB = require('./makeURLDatabase')();

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// opens the new url page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// sets username cookie parameter
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username[0]);
  res.redirect(`/urls`);
});

// create record in database
app.post("/urls", (req, res) => {
  const id = urlDB.createURL(req.body.longURL);
  res.redirect(`/urls/${id}`);
});

// delete record in database
app.post("/urls/:shortURL/delete", (req, res) => {
  urlDB.deleteURL(req.params.shortURL);
  res.redirect(`/urls`);
});

// update record in database
app.post("/urls/:shortURL/update", (req, res) => {
  console.log("req.params: ", req.params);
  console.log("req.body.longURL: ", req.body.longURL)
  urlDB.updateURL(req.params.shortURL, req.body.longURL);
  res.redirect(`/urls`);
});

// redirect to longURL page when the shortURL is input
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDB.getURL(req.params.shortURL);
  res.redirect(longURL);
});

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDB);
});

// returns urls from DB
app.get("/urls", (req, res) => {
  let templateVars = urlDB.getURLs();
  res.render("urls_index", { urls: templateVars });
});

// show the short and long URL for that short URL
app.get("/urls/:id", (req, res) => {
  const longURL = urlDB.getURL(req.params.id);
  let templateVars = {
    shortURL: req.params.id,
    longURL: longURL
  };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

