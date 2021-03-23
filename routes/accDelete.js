const express = require("express");
const deleteController = require("../controllers/accDelete");
const router = express.Router();

router.post("/accDelete", deleteController.accDelete);

module.exports = router;