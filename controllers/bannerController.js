const Banner = require("../models/Banner");
const bannerValidation = require("../validations/bannerValidation");
const paginate = require("../helpers/paginationHelper");
const sendResponse = require("../helpers/responseHelper");

const s3 = require("../config/s3");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

// ================= Upload Helper =================
const uploadToS3 = async (file) => {
  const fileName = Date.now() + "-" + file.originalname;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.send(new PutObjectCommand(params));

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};

// ================= CREATE =================
exports.createBanner = async (req, res) => {
  try {
    const { error } = bannerValidation.validate(req.body);
    if (error) {
      return sendResponse(res, 400, false, error.details[0].message);
    }

    if (!req.files?.desktopImage || !req.files?.mobileImage) {
      return sendResponse(
        res,
        400,
        false,
        "Both desktopImage and mobileImage are required"
      );
    }

    const desktopUrl = await uploadToS3(req.files.desktopImage[0]);
    const mobileUrl = await uploadToS3(req.files.mobileImage[0]);

    const banner = new Banner({
      name: req.body.name,
      link: req.body.link,
      status: req.body.status,
      desktopImage: desktopUrl,
      mobileImage: mobileUrl,
    });

    await banner.save();

    return sendResponse(res, 201, true, "Banner created successfully", banner);

  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// ================= GET =================
exports.getBanners = async (req, res) => {
  try {
    const result = await paginate(Banner, {}, req);
    return sendResponse(res, 200, true, "Banners fetched successfully", result);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// ================= UPDATE =================
exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return sendResponse(res, 404, false, "Banner not found");
    }

    banner.name = req.body.name || banner.name;
    banner.link = req.body.link || banner.link;
    banner.status = req.body.status || banner.status;

    if (req.files?.desktopImage) {
      banner.desktopImage = await uploadToS3(req.files.desktopImage[0]);
    }

    if (req.files?.mobileImage) {
      banner.mobileImage = await uploadToS3(req.files.mobileImage[0]);
    }

    await banner.save();

    return sendResponse(res, 200, true, "Banner updated successfully", banner);

  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// ================= DELETE =================
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return sendResponse(res, 404, false, "Banner not found");
    }

    return sendResponse(res, 200, true, "Banner deleted successfully");

  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};
