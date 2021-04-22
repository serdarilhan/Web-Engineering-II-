const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const show = require("../controllers/auth");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
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
    console.log(show.email);
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
router.get("/wallet", (req, res) => {

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
                        console.log(result);
                        var crypto = result[0].crypto;

                        db.query("SELECT name FROM user WHERE email = ? ", [show.email], function (err, result) {
                            if (err) {
                                console.log(err);
                            }
                            console.log(result);
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
