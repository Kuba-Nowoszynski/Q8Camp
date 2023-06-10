const ExpressError = require("./utils/ExpressError");

module.exports.validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Log in first");
    req.session.returnTo = req.originalUrl;
    return res.redirect("/login");
  }
  next();
};

module.exports.isAuthor = (model) => async (req, res, next) => {
  const { id, reviewId } = req.params;
  const foundModel = await model.findById(reviewId || id);
  if (foundModel && foundModel.author.equals(req.user._id)) {
    return next();
  } else {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
};

module.exports.storeReturnTo = (req, res, next) => {
  res.locals.returnTo = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  next();
};
