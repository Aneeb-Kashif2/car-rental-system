const mongoose = require("mongoose");
const Car = require("./models/Car");

mongoose.connect("mongodb://localhost:27017/datahandling", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cars = [
  {
    name: "Toyota Corolla",
    image: "https://toyota.com.my/wp-content/uploads/2020/07/Toyota-Corolla-Altis.jpg",
    brand: "Toyota",
    rentPerDay: 60,
    capacity: 5
  },
  {
    name: "Honda Civic",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7e/2022_Honda_Civic_Sport.jpg",
    brand: "Honda",
    rentPerDay: 70,
    capacity: 5
  },
  {
    name: "BMW X5",
    image: "https://www.freepik.com/free-ai-image/view-3d-car_66464157.htm#fromView=keyword&page=1&position=38&uuid=3f5e1ea8-3c09-49ea-ab59-24448c4fbd49&query=Bmw+Car",
    brand: "BMW",
    rentPerDay: 150,
    capacity: 7
  }
];

async function seedDB() {
  await Car.deleteMany({});
  await Car.insertMany(cars);
  console.log("Mock car data inserted!");
  mongoose.disconnect();
}

seedDB();
