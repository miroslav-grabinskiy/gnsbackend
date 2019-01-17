const config = require("../config/config.json");

const apiVersion = config.apiVersion;

const urlsForAll = [
  apiVersion + "/login",
  apiVersion + "/registration"
];

const urlsForAdmin = [];

const authMiddleware = (req, res, next) => {
  const url = req.url;
  const isAuthenticated = req.isAuthenticated();
  
  if (urlsForAll.includes(url)) {
    if (isAuthenticated) {
      return next({code: 401, message: 'You are already authenticated'});
    } else {
      return next();
    }
  }

  if (!isAuthenticated) {
    return next({code: 401, message: 'You are not authenticated'});
  } else {
    return next();
  }
};

module.exports = authMiddleware;