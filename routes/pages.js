const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const show = require("../controllers/auth");

const db = mysql.createConnection({ // Datenbank verbindung mit mysql
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
router.get("/", (req, res) => { //Registrieren anzeigen 
    res.render("index");
});

router.get("/login", (req, res) => { //Login anzeigen 
    res.render("login");
});
router.get("/home", (req, res) => {//Home anzeigen 
    db.query("SELECT name,crypto,email FROM user", function (err, result) {
        if (err) {
            console.log(err);
        }
        let array = [];
        let name = [];
        for (i in result) {
            array.push(result[i].name + " " + result[i].crypto + " " + result[i].email);
            name.push(result[i].name);
        }

        res.render("home", { //Alle registrierten User mit name und Crypto-Adresse anzeigen
            liste: array, namen: name
        });

    })

});
router.get("/profil", (req, res) => { //Im Chat der Sender namen anzeigen
    db.query("SELECT name FROM user WHERE email = ?", [show.email], function (err, result) {
        if (err) {
            console.log(err);
        }
        var name = result[0].name;
        res.render("profil", {
            sender: name
        });
    });
});
router.get("/wallet", (req, res) => { // Zahlungshistorie anzeigen 

    db.query("SELECT kontostand FROM user WHERE email = ?", [show.email], function (err, result) {
        if (err) {
            console.log(err);
        }
        var kontostand = result[0].kontostand;
        db.query("SELECT mining FROM user WHERE email = ?", [show.email], function (err, result) {
            if (err) {
                console.log(err);
            }
            var mining = result[0].mining;
            db.query("SELECT crypto FROM user WHERE email = ?", [show.email], function (err, reuslt) {
                if (err) {
                    console.log(err);
                }
                var sender = reuslt[0].crypto;
                db.query("SELECT amount,date,info FROM transaction WHERE sender = ?", [sender], function (err, results) {
                    if (err) {
                        console.log(err);
                    }

                    let ergebnis = [];
                    for (var i in results) {

                        ergebnis.push(results[i].amount + " " + results[i].date + " " + results[i].info + " ");

                    }


                    db.query("SELECT crypto FROM user WHERE email = ? ", [show.email], function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        var crypto = result[0].crypto;

                        db.query("SELECT name FROM user WHERE email = ? ", [show.email], function (err, result) {
                            if (err) {
                                console.log(err);
                            }
                            var name = result[0].name;

                            function response() {
                                res.render("wallet", {
                                    mining: mining, kontostand: kontostand, History: ergebnis, crypto: crypto, name: name, email: show.email
                                });
                            }
                            response();
                        })

                    })

                })


            })


        });

    });
});
module.exports = router;
