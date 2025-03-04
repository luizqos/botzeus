const express = require("express");
const router = express.Router();
const healthController = require("../controllers/health");

router.get("/check", healthController.check);

module.exports = router;
