const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({ url: String, filename: String });
ImageSchema.virtual("cardImage").get(function () {
  return this.url.replace("/upload", "/upload/ar_16:9,c_crop");
});
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200,h_100");
});

const opts = { toJSON: { virtuals: true } };
const campgroundSchema = new Schema(
  {
    title: String,
    price: Number,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    images: [ImageSchema],
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

campgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
  <p>${this.description.slice(0, 30)}...</p>`;
});

campgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
