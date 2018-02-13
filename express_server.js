const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const myDatabases = require('./makeURLDatabase');
const cookieSession = require('cookie-session');
const myURLDB = myDatabases.makeURLDB();
const myUserDB = myDatabases.makeUserDB();

const PORT = process.env.PORT || 8080;
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

// clears session and logs out - goes to urls page
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
})

// returns registration page
app.get("/register", (req, res) => {
  res.render("urls_register");
});
// posts registration page and creates record in UserDB. Stores session
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
    // console.log('id:', id);
    const user = myUserDB.getUser(id);
    // console.log('user:', user);
    req.session.user_id = id;
    res.redirect(`/urls`);
  }
});

// opens the new url page
app.get("/urls/new", (req, res) => {
  let templateVars = {
    // user: req.session.user_id,
    // email: req.body.email
    user: myUserDB.getUser(req.session.user_id)
  };
  // console.log("templateVars in /urls/new: ", templateVars);
  if (req.session.user_id) {
    res.render("urls_new", templateVars);
  } else { res.redirect("/login")}
});

// opens new login page
app.get("/login", (req, res) => {
    res.render("urls_login");
});

// checks if login info is correct
app.post("/login", (req, res) => {
  let users = myUserDB.getUsers();
  // console.log("users: ", users);
  if ((req.body.email) && (req.body.pwd)) {
    for (key in users) {
      if ((req.body.email === users[key].email) && (req.body.pwd === users[key].pwd)) {
        let user_id = myUserDB.getUserbyEmail(req.body.email, req.body.pwd);
        req.session.user_id = user_id;
        if (req.session.user_id) {
          return res.redirect('/urls');
        } else { res.redirect("/login")}
      }
    }
  }
  res.status(403).send('Email and password combination is not correct');

});

// create record in database
app.post("/urls", (req, res) => {
  // console.log("req.session: ",req.session);
  const id = myURLDB.createURL(req.session.user_id, req.body.longURL);
  // console.log(myURLDB.getURLs());
  // res.redirect(`/urls/${id}`);
  res.redirect(`/urls`);
});

// delete record in database
app.post("/urls/:shortURL/delete", (req, res) => {
  myURLDB.deleteURL(req.params.shortURL);
  res.redirect(`/urls`);
});

// NEED TO FIGURE OUT THE HASOWNPROPERTY THING - MAYBE JUST SEE IF IT'S IN DB??
// update record in database
app.post("/urls/:shortURL/update", (req, res) => {
  // console.log("req.session.user_id: ", req.session.user_id);
  // console.log("req.params.shortURL: ", req.params.shortURL);
  // console.log("myURLDB: ", myURLDB.getURL(req.params.shortURL).shortURL);

  let dbShortURL = myURLDB.getURL(req.params.shortURL);
  let sessionUser = req.session.user_id;

  // console.log('dbShortURL:', dbShortURL);
  // console.log('myURLDB.getURLs(): ', myURLDB.getURLs());

  if (sessionUser) {
  //  if (myURLDB.getURL(req.params.shortURL).hasOwnProperty(myURLDB.getURL(req.params.shortURL).shortURL)) {
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
  // console.log("req.session. in get urls:", req.session);
  let templateVars = {
      urls: myURLDB.getURLsbyUserId(req.session.user_id),
      user: myUserDB.getUser(req.session.user_id)
  };
  // console.log('templateVars in app.get /urls: ', templateVars);
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
  // console.log('templateVars:', templateVars);
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

