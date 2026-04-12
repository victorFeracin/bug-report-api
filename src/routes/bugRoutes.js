const express = require("express");
const bugController = require("../controllers/bugController");
const validateBugReport = require("../middlewares/validateBugReport");

const router = express.Router();

router.post("/bugs", validateBugReport, bugController.createBug);

module.exports = router;
