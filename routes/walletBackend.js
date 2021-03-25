const express = require("express");
const walletController = require("../controllers/walletBackend");
const router = express.Router();


router.post("/wallet", walletController.wallet);

router.post("/mining", walletController.mining);

router.post("/auszahlen", walletController.auszahlen);

router.post("/showCrypto", walletController.showCrypto);

router.post("/showKontostand", walletController.showKontostand);
router.post("/showMining", walletController.showMining);
router.post("/showHistorie", walletController.showHistorie);


module.exports = router;
