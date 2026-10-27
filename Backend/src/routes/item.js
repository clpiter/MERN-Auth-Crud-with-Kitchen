const express = require('express');
const itemController = require("../controllers/item");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.use(authMiddleware.authenticateToken);

router.get("/items", itemController.getItems);
router.get("/items/:id", itemController.getItem);
router.post("/items", itemController.createItem);
router.put("/items/:id", itemController.updateItem);
router.delete("/items/:id", itemController.deleteItem);

module.exports = router;
