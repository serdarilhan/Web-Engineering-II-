const express = require("express");
const router = express.Router();
const kontostand = require("../controllers/walletBackend");

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/login", (req, res) => {
    res.render("login");
});
router.get("/home", (req, res) => {
    res.render("home");
});
router.get("/profil", (req, res) => {
    res.render("profil");
});
router.get("/wallet", (req, res) => {

    res.render("wallet");


});
module.exports = router;
