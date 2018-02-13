const express = require("express");
const bodyParser = require("body-parser");
const myDatabases = require("./makeURLDatabase");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const myURLDB = myDatabases.makeURLDB();
const myUserDB = myDatabases.makeUserDB();

const PORT = process.env.PORT || 8080;
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  // Cookie Options // 24 hours
  maxAge: 24 * 60 * 60 * 1000
}));


// clears session and logs out - goes to urls page
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// returns registration page
app.get("/register", (req, res) => {
  res.render("urls_register");
});
// posts registration page and creates record in UserDB. Stores session
// error handling for registration page
app.post("/register", (req, res, err) => {
  let userEmail = myUserDB.getUsers();
  let success = 1;
  let hashedPassword = bcrypt.hashSync(req.body.pwd, 10);
  if ((req.body.email) && (hashedPassword)) {
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
    const id = myUserDB.createUser(req.body.email, hashedPassword);
    const user = myUserDB.getUser(id);
    res.redirect(`/urls`);
  }
});

// opens the new url page
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: myUserDB.getUser(req.session.user_id)
  };
  if (req.session.user_id) {
    res.render("urls_new", templateVars);
  } else { res.redirect("/login"); }
});

// opens new login page
app.get("/login", (req, res) => {
  res.render("urls_login");
});

// checks if login info is correct
app.post("/login", (req, res) => {
  let users = myUserDB.getUsers();
  if ((req.body.email) && (req.body.pwd)) {
    for (key in users) {
      if ((req.body.email === users[key].email) && bcrypt.compareSync(req.body.pwd, users[key].pwd)) {
        let user_id = myUserDB.getUserbyEmail(req.body.email, users[key].pwd);
        req.session.user_id = user_id;
        if (req.session.user_id) {
          return res.redirect('/urls');
        } else { res.redirect("/login"); }
      }
    }
  }
  res.status(403).send('Email and password combination is not correct');

});

// create record in database
app.post("/urls", (req, res) => {
  const id = myURLDB.createURL(req.session.user_id, req.body.longURL);
  res.redirect(`/urls`);
});

// delete record in database
app.post("/urls/:shortURL/delete", (req, res) => {
  myURLDB.deleteURL(req.params.shortURL);
  res.redirect(`/urls`);
});

// update record in database
app.post("/urls/:shortURL/update", (req, res) => {

  let dbShortURL = myURLDB.getURL(req.params.shortURL);
  let sessionUser = req.session.user_id;
  if (sessionUser) {
    if (dbShortURL) {
      if (sessionUser === dbShortURL.userId) {
        myURLDB.updateURL(req.params.shortURL, req.body.longURL);
        res.redirect(`/urls`);
      } else { res.send("You don't own this short URL."); }
    } else { res.send("This short URL doesn't exist."); }
  } else { res.send("Log in first to view your short URLs."); }
});

// redirect to longURL page when the shortURL is input
app.get("/u/:shortURL", (req, res) => {
  let longURL = myURLDB.getURL(req.params.shortURL);
  res.redirect(longURL);
});

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(myURLDB.makeURLDB());
});

// returns urls from DB
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: myURLDB.getURLsbyUserId(req.session.user_id),
    user: myUserDB.getUser(req.session.user_id)
  };
  res.render("urls_index", templateVars);
});

// show the short and long URL for that short URL
app.get("/urls/:id", (req, res) => {
  const longURL = myURLDB.getURL(req.params.id);
  let templateVars = {
    shortURL: req.params.id,
    longURL: longURL.longURL,
    user: myUserDB.getUser(req.session.user_id)
  };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

