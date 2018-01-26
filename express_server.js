const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const myDatabases = require('./makeURLDatabase');
const myURLDB = myDatabases.makeURLDB();
const myUserDB = myDatabases.makeUserDB();

const PORT = process.env.PORT || 8080;
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// clears username cookie and logs out - goes to urls page
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.clearCookie("user");
  res.clearCookie("username")
  res.redirect("/urls");
})

// returns registration page
app.get("/register", (req, res) => {
  res.render("urls_register");
});

// posts registration page and creates record in UserDB. Stores cookie
// error handling for registration page
app.post("/register", (req, res, err) => {
  let userEmail = myUserDB.getUsers();
  let success = 1;
  if ((req.body.email) && (req.body.pwd)) {
    for (key in userEmail) {
      if (req.body.email === userEmail[key].email) {
        res.status(400).send('Email address already exists');
        success = 0;
      }
    }
  } else {
    res.status(400).send('Email or password field cannot be blank');
    success = 0;
  }

  if (success === 1) {
    const id = myUserDB.createUser(req.body.email, req.body.pwd);
    const user = myUserDB.getUser(id);
    res.cookie('user', user);
    res.redirect(`/urls`);
  }
});

// opens the new url page
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: req.cookies["user"],
  };
  console.log("templateVars: ", templateVars);
res.render("urls_new", templateVars);
});

// opens new login page
app.get("/login", (req, res) => {
    res.render("urls_login");
});

// checks if login info is correct
app.post("/login", (req, res) => {
  let userEmail = myUserDB.getUsers();
  if ((req.body.email) && (req.body.pwd)) {
    for (key in userEmail) {
      if ((req.body.email === userEmail[key].email) && (req.body.pwd === userEmail[key].pwd)) {
        res.cookie('user_id', req.body.id);
        return res.redirect('/');
      }
    }
  }
  res.status(403).send('Email and password combination is not correct');

});

// create record in database
app.post("/urls", (req, res) => {
  const id = myURLDB.createURL(req.body.longURL);
  res.redirect(`/urls/${id}`);
});

// delete record in database
app.post("/urls/:shortURL/delete", (req, res) => {
  myURLDB.deleteURL(req.params.shortURL);
  res.redirect(`/urls`);
});

// update record in database
app.post("/urls/:shortURL/update", (req, res) => {
  myURLDB.updateURL(req.params.shortURL, req.body.longURL);
  res.redirect(`/urls`);
});

// redirect to longURL page when the shortURL is input
app.get("/u/:shortURL", (req, res) => {
  let longURL = myURLDB.getURL(req.params.shortURL);
  res.redirect(longURL);
});

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(myURLDB.makeURLDB());
});

// returns urls from DB
app.get("/urls", (req, res) => {
  let templateVars = {
      urls: myURLDB.getURLs(),
      user: req.cookies["user"]
  };
  res.render("urls_index", templateVars);
});

// show the short and long URL for that short URL
app.get("/urls/:id", (req, res) => {
  const longURL = myURLDB.getURL(req.params.id);
  let templateVars = {
    shortURL: req.params.id,
    longURL: longURL,
    user: req.cookies["user"]
  };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

