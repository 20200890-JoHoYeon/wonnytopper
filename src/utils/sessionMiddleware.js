const checkSessionMiddleware = (req, res, next) => {
  if (!req.session.user) {
    if (req.cookies.topper) {
      req.session.user = {
        id: req.cookies.topper,
      };
    } else {
      return res.redirect("/admin/index");
    }
  }
  next();
};

module.exports = checkSessionMiddleware;
