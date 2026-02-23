const User = require("../models/userModel");


// ================= CREATE =================
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.json({
      name: user.name,
      email: user.email,
      age: user.age
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= READ =================
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email age -_id");

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= UPDATE =================
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      name: user.name,
      email: user.email,
      age: user.age
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= DELETE =================
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= DOWNLOAD CSV (MANUAL) =================
exports.downloadCSV = async (req, res) => {
  try {

    const users = await User.find()
      .select("name email age -_id")
      .lean();

    if (!users.length) {
      return res.send("No data available");
    }

    let csv = "name,email,age\n";

    users.forEach(user => {
      csv += `${user.name},${user.email},${user.age}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=users.csv"
    );

    res.send(csv);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= UPLOAD CSV (MANUAL) =================
exports.uploadCSV = async (req, res) => {
  try {

    const csvText = req.file.buffer.toString("utf-8");

    const rows = csvText.split("\n")
      .map(row => row.trim())
      .filter(row => row !== "");

    const headers = rows[0].split(",").map(h => h.trim());

    let inserted = 0;
    let updated = 0;

    for (let i = 1; i < rows.length; i++) {

      const values = rows[i].split(",").map(v => v.trim());

      let obj = {};

      headers.forEach((header, index) => {
        obj[header] = values[index];
      });

      if (!obj.email) continue;

      const cleanEmail = obj.email.trim().toLowerCase();

      const userData = {
        name: obj.name,
        email: cleanEmail,
        age: Number(obj.age)
      };

      const existingUser = await User.findOne({ email: cleanEmail });

      if (existingUser) {
        await User.updateOne(
          { email: cleanEmail },
          { $set: userData }
        );
        updated++;
      } else {
        await User.create(userData);
        inserted++;
      }
    }

    res.json({
      message: "CSV processed successfully",
      inserted,
      updated
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};