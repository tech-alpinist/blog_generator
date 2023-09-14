const express = require("express");
const router = express.Router();

const collectionController = require('../controllers/collectionController')

router.get('/:id', collectionController.collection);
router.get("/", collectionController.collections);  
router.post("/update", collectionController.update);
router.post('/update_publishing', collectionController.updatePublishing)

module.exports = router;
