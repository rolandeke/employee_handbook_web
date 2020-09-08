module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }

    req.flash("err_msg","Login in to view resources")
    res.redirect("/login");
  },
};
