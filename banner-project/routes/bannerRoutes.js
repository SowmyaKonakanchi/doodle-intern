const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = require("../middlewares/uploadMiddleware");
const bannerController = require("../controllers/bannerController");


// -------------------- CREATE --------------------
router.post("/", (req, res) => {
  upload.fields([
    { name: "desktopImage", maxCount: 1 },
    { name: "mobileImage", maxCount: 1 },
  ])(req, res, function (err) {

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size should not exceed 6MB",
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    bannerController.createBanner(req, res);
  });
});


// -------------------- GET --------------------
router.get("/", bannerController.getBanners);


// -------------------- UPDATE --------------------
router.put("/:id", (req, res) => {
  upload.fields([
    { name: "desktopImage", maxCount: 1 },
    { name: "mobileImage", maxCount: 1 },
  ])(req, res, function (err) {

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size should not exceed 6MB",
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    bannerController.updateBanner(req, res);
  });
});


// -------------------- DELETE --------------------
router.delete("/:id", bannerController.deleteBanner);

module.exports = router;
