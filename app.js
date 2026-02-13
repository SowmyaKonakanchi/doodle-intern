const express = require("express");
const mongoose = require("mongoose");
const bannerRoutes = require("./routes/bannerRoutes");

const app = express();


app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose
  .connect("mongodb://127.0.0.1:27017/bannerDB")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Error:", err));

app.use("/api/banners", bannerRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
