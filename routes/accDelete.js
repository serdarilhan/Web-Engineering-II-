const express = require("express");
const deleteController = require("../controllers/accDelete");
const router = express.Router();

router.post("/accDelete", deleteController.accDelete);

router.post("/changeName", deleteController.nameChange);

module.exports = router;