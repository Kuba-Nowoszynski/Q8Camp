const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedsHelpers");

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => console.log("Connected to the Database"))
  .catch((e) => console.log(`Error: ${e}`));

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 400; i++) {
    const cityRand = sample(cities);
    const camp = new Campground({
      author: "6458d65c0bce7c3fd4ee2f58",
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [cityRand.longitude, cityRand.latitude],
      },
      location: `${cityRand.city}, ${cityRand.state}`,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil sed cupiditate omnis vitae fugiat debitis ipsa ratione aspernatur mollitia deleniti natus maiores, placeat beatae qui obcaecati ut ab non quisquam!",
      price: Math.floor(Math.random() * 20 + 10),
      images: {
        url: "https://source.unsplash.com/random/?camping",
        filename: `${sample(cities)}${cityRand.length}seed${
          Math.random() * 999
        }${sample(cities)}`,
      },
    });
    await camp.save();
  }
  const camps = await Campground.find({});
  console.log(camps);
};

seedDB().then(() => mongoose.connection.close());
