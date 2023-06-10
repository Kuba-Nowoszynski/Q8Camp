const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const camp = new Campground(req.body.campground);
  camp.geometry = geoData.body.features[0].geometry;
  camp.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  camp.author = req.user._id;
  await camp.save();
  req.flash("success", "Successfully added a new campground!");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.showCampground = async (req, res, next) => {
  const { id } = req.params;
  const camp = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!camp) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { camp });
};

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (!camp) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { camp });
};

module.exports.updateCampground = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();

  const { id } = req.params;
  const imgs = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  const camp = await Campground.findById(id);
  await Campground.findByIdAndUpdate(
    id,
    {
      ...req.body.campground,
      images: [...camp.images, ...imgs],
      geometry: geoData.body.features[0].geometry,
    },
    {
      new: true,
    }
  );
  if (req.body.deleteImages) {
    for (const filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await camp.updateOne({
      $pull: {
        images: { filename: { $in: req.body.deleteImages } },
      },
    });
  }
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted the campground!");
  res.redirect("/campgrounds");
};
