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
  function createURL(userId, longURL) {
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = {
      userID: userId,
      shortURL: shortURL,
      longURL: longURL,
    };
    return shortURL;
  }

  function updateURL(shortURL, longURL) {
    console.log("shortURL: ", shortURL);
    console.log("longURL: ", longURL);

    urlDatabase[shortURL] = longURL;
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
      pwd: "purple-monkey-dinosaur"
    },
   "user2RandomID": {
      id: "user2RandomID",
      email: "user2@example.com",
      pwd: "dishwasher-funk"
    },
   "user3RandomID": {
      id: "user3RandomID",
      email: "user3@example.com",
      pwd: "revv52-madness"
    }
  };

  function getUsers() {
    return users;
  }

  function getUser(userId) {
    return users[userId];
  }

  function createUser(email, password) {
    const userID = generateRandomString();
    users[userID] = {
      id: userID,
      email: email,
      pwd: password
    }
    return userID;
  }

  return {
    getUsers,
    getUser,
    createUser
  };
}

module.exports.makeURLDB = makeURLDB;
module.exports.makeUserDB = makeUserDB;