const bcrypt = require("bcrypt");

function makeURLDB() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const alphabet = `${letters + letters.toUpperCase()}0123456789`;

  function generateRandomString() {
    let chars = '1234567890abcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = 6; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  const urlId = generateRandomString();
  const urlDatabase = {
    "b2xVn2": {
      userId: "userRandomID",
      shortURL: "b2xVn2",
      longURL: "http://www.lighthouselabs.ca"
    },
    "9sm5xK": {
      userId: "user2RandomID",
      shortURL: "9sm5xK",
      longURL: "http://www.google.com"
    }
  };

  function getURLs() {
    return urlDatabase;
  }

  function getURL(urlId) {
    return urlDatabase[urlId];
  }

  function getURLsbyUserId(userId) {
    let userURLs = {};
    for (const key in urlDatabase) {
      if (urlDatabase[key].userId === userId ) {
        userURLs[key] = urlDatabase[key];
      }
    }
    return userURLs;
  }

  function getURLbyUserId(userId, urlId) {
    let userURL = {};
    for (const key in urlDatabase) {
      if (urlDatabase[key].userId === userId ) {
        if (urlDatabase[key].shortURL === urlId)
          userURL[key] = urlDatabase[key];
      }
    }  
    return userURL;
  }

  function createURL(userId, longURL) {
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = {
      userId: userId,
      shortURL: shortURL,
      longURL: longURL
    };
    return shortURL;
  }

  function updateURL(shortURL, longURL) {
    urlDatabase[shortURL].longURL = longURL;
    return urlDatabase[shortURL];
  }

  function deleteURL(urlID) {
    delete urlDatabase[urlID];
  }
  return {
    getURL,
    getURLs,
    deleteURL,
    updateURL,
    createURL,
    getURLsbyUserId,
    getURLbyUserId
  };
}

function makeUserDB() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const alphabet = `${letters + letters.toUpperCase()}0123456789`;

  function generateRandomString() {
    let chars = '1234567890abcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = 8; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  const users = {
    "userRandomID": {
      id: "userRandomID",
      email: "user@example.com",
      pwd: bcrypt.hashSync("123", 10)
    },
    "user2RandomID": {
      id: "user2RandomID",
      email: "user2@example.com",
      pwd: bcrypt.hashSync("dishwasher-funk", 10)
    },
    "user3RandomID": {
      id: "user3RandomID",
      email: "user3@example.com",
      pwd: bcrypt.hashSync("revv52-madness", 10)
    }
  };

  function getUsers() {
    return users;
  }

  function getUser(userId) {
    return users[userId];
  }

  function getUserbyEmail(email, pwd) {
    let userbyEmail = {};
    for (const key in users) {
      if (users[key].email === email && users[key].pwd === pwd) {
        userbyEmail[key] = users[key];
      }
    }
    return userbyEmail[key].id;
  }

  function createUser(email, password) {
    const userID = generateRandomString();
    users[userID] = {
      id: userID,
      email: email,
      pwd: password
    };
    return userID;
  }

  return {
    getUsers,
    getUser,
    createUser,
    getUserbyEmail
  };
}

module.exports.makeURLDB = makeURLDB;
module.exports.makeUserDB = makeUserDB;
