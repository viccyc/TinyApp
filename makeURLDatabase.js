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
    // console.log('userId in getURLsbyUserId: ', userId);

    let userURLs = {};
    for (const key in urlDatabase) {
      // console.log('urlDatabase[key] in getURLsbyUserId: ', urlDatabase[key]);
      if (urlDatabase[key].userId === userId ) {
        userURLs[key] = urlDatabase[key];
      }
    }
    // console.log('userURLs in getURLsbyUserId: ', userURLs)
    return userURLs;
  }

  function createURL(userId, longURL) {
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = {
      userId: userId,
      shortURL: shortURL,
      longURL: longURL,
    };
    // console.log("createURL after create: ", urlDatabase);
    return shortURL;
  }

  function updateURL(shortURL, longURL) {
    // console.log("updateURL before update shortURL: ", shortURL);
    // console.log("updateURL before update longURL: ", longURL);

    urlDatabase[shortURL].longURL = longURL;

    // console.log("updateURL after update: ", urlDatabase);
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
    getURLsbyUserId
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
      pwd: "123"
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

  function getUserbyEmail(email, pwd) {
    let userbyEmail = {};
    // console.log("getUserbyEmail email and pwd: ", email, pwd)
    for (const key in users) {
      if (users[key].email === email && users[key].pwd === pwd) {
        userbyEmail[key] = users[key];
      }
    }
    // console.log('user in getUserbyEmail.id: ', userbyEmail[key].id);
    return userbyEmail[key].id;
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
    createUser,
    getUserbyEmail
  };
}

module.exports.makeURLDB = makeURLDB;
module.exports.makeUserDB = makeUserDB;
