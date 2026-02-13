const express = require("express");
const router = express.Router();
const Banner = require("../models/Banner");
const multer = require("multer");
const path = require("path");
const bannerValidation = require("../validations/bannerValidation");

// ===== MULTER CONFIG =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.fieldname + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });


// ===== CREATE =====
router.post(
  "/",
  upload.fields([
    { name: "desktopImage", maxCount: 1 },
    { name: "mobileImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { error } = bannerValidation.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      if (!req.files || !req.files.desktopImage || !req.files.mobileImage) {
        return res.status(400).json({
          message: "Both desktopImage and mobileImage are required",
        });
      }

      const banner = new Banner({
        name: req.body.name,
        link: req.body.link,
        status: req.body.status,
        desktopImage: req.files.desktopImage[0].path,
        mobileImage: req.files.mobileImage[0].path,
      });

      await banner.save();

      res.status(201).json({
        message: "Banner created successfully",
        data: banner,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


// ===== GET =====
router.get("/", async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: 1 });
    res.status(200).json({ data: banners });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ===== UPDATE =====
router.put(
  "/:id",
  upload.fields([
    { name: "desktopImage", maxCount: 1 },
    { name: "mobileImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const banner = await Banner.findById(req.params.id);

      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }

      banner.name = req.body.name || banner.name;
      banner.link = req.body.link || banner.link;
      banner.status = req.body.status || banner.status;

      if (req.files && req.files.desktopImage) {
        banner.desktopImage = req.files.desktopImage[0].path;
      }

      if (req.files && req.files.mobileImage) {
        banner.mobileImage = req.files.mobileImage[0].path;
      }

      await banner.save();

      res.status(200).json({
        message: "Banner updated successfully",
        data: banner,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


// ===== DELETE =====
router.delete("/:id", async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.status(200).json({
      message: "Banner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
