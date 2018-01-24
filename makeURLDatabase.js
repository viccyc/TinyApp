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
  function createURL(shortURL, longURL) {
    const urlId = generateRandomString();
    urlDatabase[urlId] = {
      shortURL,
      longURL,
    };
    return urlId;
  }
  function updateURL(shortURL, longURL) {
    if (!urlDatabase[shortURL]) return 'You are dumb';
    Object.assign(urlDatabase[shortURL], { longURL });
    return urlDatabase[shortURL];
  }
  function deleteURL(id) {
    delete urlDatabase[id];
  }
  return {
    getURL,
    getURLs,
    deleteURL,
    updateURL,
    createURL,
  };
}

module.exports = makeURLDB;