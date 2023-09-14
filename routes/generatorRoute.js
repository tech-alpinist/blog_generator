const express = require("express");
const router = express.Router();
const generatorController = require("../controllers/generatorController");

router.post("/pdf", generatorController.generatePDF);
router.post("/translatedpdf", generatorController.translate_downloadPDF);
router.post("/template", generatorController.generateTemplate);
router.post("/content", generatorController.generateContent);
router.post("/part", generatorController.generatePart);

router.post('/title', generatorController.generateTitle)
router.post('/listing_info', generatorController.generateIntroduction)
router.post('/description', generatorController.generateDescription)

module.exports = router;
