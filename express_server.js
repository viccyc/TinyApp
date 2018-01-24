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

app.post("/urls", (req, res) => {
  // console.log("req.body :", req.body);
  // var randomString = urlDB.generateRandomString();
  // urlDB[randomString] = req.body.longURL;
  // res.redirect("http://localhost:8080/urls/" + randomString);
  const id = urlDB.createURL(req.body.shortURL, req.body.long);
  res.redirect(`/urls/${id}`);


});

app.get("/u/:shortURL", (req, res) => {
  console.log("req.url: ", req.url);
  let longURL = urlDB[req.params.id];
  console.log("longURL: ", longURL);
  // res.redirect(longURL);
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
  console.log("templateVars: ", templateVars);
  res.render("urls_index", { urls: templateVars });
});

app.get("/urls/:id", (req, res) => {
  const longURL = urlDB[req.params.id];
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

// function generateRandomString() {
//   let chars = '1234567890abcdefghijklmnopqrstuvwxyz';
//   var result = '';
//   for (var i = 6; i > 0; --i) {
//     result += chars[Math.floor(Math.random() * chars.length)];
//   }
//   return result;
// }
