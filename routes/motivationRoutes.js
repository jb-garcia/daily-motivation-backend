const express = require("express");
const { generateMotivation } = require("../controllers/geminiController");

const router = express.Router();
router.post("/motivation", generateMotivation);

module.exports = router;
