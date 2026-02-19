require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const bannerRoutes = require("./routes/bannerRoutes");

const app = express();

// ================= Middleware =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= Debug ENV Check (Temporary) =================
console.log("AWS REGION:", process.env.AWS_REGION);
console.log("AWS BUCKET:", process.env.AWS_BUCKET_NAME);

// ================= MongoDB Connection =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Error:", err));

// ================= Routes =================
app.use("/api/banners", bannerRoutes);

// ================= Root Route =================
app.get("/", (req, res) => {
  res.send("Banner API running...");
});

// ================= Start Server =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
