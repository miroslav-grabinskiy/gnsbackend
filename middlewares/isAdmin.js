const isAdmin = (req, res, next) => {
  if (!req.user.dataValues.isAdmin) {
    return next({code: 404, message: 'Not Found'});
  } else {
    return next();
  }
};

module.exports = isAdmin;