const express = require("express");
const walletController = require("../controllers/walletBackend");
const router = express.Router();


router.post("/wallet", walletController.wallet);

router.post("/mining", walletController.mining);

router.post("/auszahlen", walletController.auszahlen);





module.exports = router;
