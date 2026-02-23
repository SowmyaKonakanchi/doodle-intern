const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middlewares/upload");

// CRUD
router.post("/", userController.createUser);
router.get("/", userController.getUsers);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

// CSV
router.get("/download-csv", userController.downloadCSV);
router.post("/upload-csv", upload.single("file"), userController.uploadCSV);

module.exports = router;