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
      "b2xVn2": "http://www.lighthouselabs.ca",
      "9sm5xK": "http://www.google.com",
  };

  function getURLs() {
    return urlDatabase;
  }
  function getURL(urlId) {
    return urlDatabase[urlId];
  }
  function createURL(longURL) {
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = longURL;
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

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
 "user3RandomID": {
    id: "user3RandomID",
    email: "user3@example.com",
    password: "revv52-madness"
  }
}

module.exports = makeURLDB;
module.exports = { users };