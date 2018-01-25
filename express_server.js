const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8080;
const urlDB = require('./makeURLDatabase');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

console.log("users: ", urlDB.users);

// clears username cookie and logs out - goes to urls page
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
})

// returns registration page
app.get("/register", (req, res) => {
  res.render("urls_register");
});

// posts registration page
app.post("/register", (req, res) => {
  console.log("req.body: ", req.body);
  res.redirect(`/urls`);
});

// opens the new url page
app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
  };
res.render("urls_new", templateVars);
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
  let templateVars = {
      urls: urlDB.getURLs(),
      username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

// show the short and long URL for that short URL
app.get("/urls/:id", (req, res) => {
  const longURL = urlDB.getURL(req.params.id);
  let templateVars = {
    shortURL: req.params.id,
    longURL: longURL,
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

