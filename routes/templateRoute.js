const express = require("express");
const router = express.Router();

const templateController = require("../controllers/templateController");

router.get("/", templateController.templates);
router.get("/:id", templateController.template);
router.post("/update", templateController.update);

module.exports = router;
