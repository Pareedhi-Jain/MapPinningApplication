const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./routes/users");


const pinRoute = require("./routes/pins");

app.use(express.json());

// // Directly use the MongoDB connection string
// const dbUri = 'mongodb+srv://deployed:kjsuQQbaUYAI7iUw@cluster.iihc69u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster';

// if (!dbUri) {
//   console.error("MongoDB URI is not defined.");
//   process.exit(1); // Exit the application if the URI is not defined
// }

mongoose.connect('mongodb+srv://deployed:kjsuQQbaUYAI7iUw@cluster.iihc69u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster')
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });


app.use("/users", userRoute);
app.use("/pins",pinRoute);


app.listen(8800, () => {
  console.log("Server is running on port 8800");
});

