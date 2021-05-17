const mysql = require("mysql");
const show = require("../controllers/auth");
const t = require("../controllers/walletBackend");

const db = mysql.createConnection({ //Datenbank verbindung mit mysql
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.wallet = (req, res) => {

    var adresse = req.body.adress;
    var amountString = req.body.money;
    var amount = parseFloat(amountString);
    var email = show.email;


    db.query("SELECT crypto FROM user WHERE email = ? ", [email], function (err, result) {
        if (err) {
            console.log(err);
        }
        var loggedInCrypto = result[0].crypto; //Abfrage ob die angegebene Crypto-Adresse nicht die eigene ist 
        if (loggedInCrypto == adresse) {
            res.render("wallet", {
                message1: "Fehler, es ist ihre Adresse!!!"
            });
        }


        db.query("SELECT crypto FROM user WHERE crypto = ?", [adresse], function (err, result) {
            if (err) {
                console.log(err);
            }
            if (result[0] == undefined) {   // Abfrage ob die Crypto-Adresse existiert 
                res.render("wallet", { message2: "Keine gültige Adresse" });
                //res.redirect("../wallet");
            } else {
                db.query("SELECT kontostand FROM user WHERE email = ?", [email], function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    var max_send_money = result[0].kontostand;  // Nun wird abgefragt ob die anzahl der Coins vorhanden ist 

                    if (amount > max_send_money) {
                        res.render("wallet", {
                            message3: "Sie haben zu wenige Coins!!!"
                        })
                    } else {
                        db.query("SELECT kontostand FROM user WHERE crypto = ?", [adresse], function (err, result) {
                            if (err) {
                                console.log(err);
                            }
                            var kontostand = result[0].kontostand;
                            var neuerKontostand = kontostand + amount;
                            var neuerKontostandSender = max_send_money - amount;

                            var datum = new Date();

                            db.query('UPDATE user SET ? WHERE crypto = ?', [{ kontostand: neuerKontostand }, adresse]);
                            db.query('UPDATE user SET ? WHERE email = ?', [{ kontostand: neuerKontostandSender }, email]);
                            db.query('INSERT INTO transaction SET ?', { sender: loggedInCrypto, receiver: adresse, amount: amount, date: datum, info: "Transaction" });
                            res.render("wallet", {
                                message4: "Transaktion erfolgreich!!!" // Hier werden die Kontostände dementsprechend ausgeglichen und in der datenbank eingetragen
                            })

                        })

                    }
                })
            }
        })
    });
    res.status(200).redirect("back");


}

exports.mining = (req, res) => {
    var amountMining1 = req.body.mining;
    var amountMining = parseFloat(amountMining1);
    var email = show.email;

    db.query("SELECT kontostand FROM user WHERE email = ?", [email], function (err, result) {
        if (err) {
            console.log(err);
        }
        var max_send_money = result[0].kontostand;

        db.query("SELECT mining FROM user WHERE email = ?", [email], function (err, result) {
            if (err) {
                console.log(err);
            }
            var neuMining = amountMining + result[0].mining;
            var neuerKontostandUser = max_send_money - amountMining;


            if (amountMining > max_send_money) { //Falls die anzahl der Coins zum minien nicht ausreicht 
                res.render("wallet", {
                    message5: "Sie haben zu wenige Coins!!!"
                })
            } else {
                db.query('UPDATE user SET ? WHERE email = ?', [{ mining: neuMining }, email]);
                db.query('UPDATE user SET ? WHERE email = ?', [{ kontostand: neuerKontostandUser }, email]);

                res.render("wallet", {
                    message6: "Mining erfolgreich durchgeführt!!!"
                })
                //Mining-Stand wird angepasst und in der Datenbank eingetragen
                var count = neuMining;
                function counter() { // Mining funktion mit einem faktor wird alle 2 sekunden in datenbank refresht 
                    count = count + 0.1;
                    db.query("UPDATE user SET ? WHERE email = ?", [{ mining: count }, email]);
                    return count;

                }
                var t = setInterval(counter, 2000);

                exports.t = t;

                db.query("SELECT crypto FROM user WHERE email = ?", [email], function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    var mining_crypto = result[0].crypto;
                    var datum = new Date();
                    db.query('INSERT INTO transaction SET ?', { sender: mining_crypto, receiver: mining_crypto, amount: amountMining, date: datum, info: "Mining" });
                });



                res.redirect("back");


            }
        })


    })

}
exports.auszahlen = (req, res) => {
    var amountAuszahlen = req.body.auszahlen;
    var amountMining = parseFloat(amountAuszahlen);
    var email = show.email;

    function stop() {
        clearInterval(t.t)  // Beim auzahlen wird die mining funktion gestoppt 
    };

    stop();

    db.query("SELECT mining FROM user WHERE email = ?", [email], function (err, result) {
        if (err) {
            console.log(err);
        }

        if (amountMining <= result[0].mining) {
            var neuesMining = result[0].mining - amountMining;

            db.query("SELECT kontostand FROM user WHERE email = ?", [email], function (err, result) {
                if (err) {
                    console.log(err);
                }
                var kontostand = result[0].kontostand;
                var neuerKontostand = kontostand + amountMining;
                db.query("UPDATE user SET ? WHERE email = ?", [{ mining: neuesMining }, email]);
                db.query("UPDATE user SET ? WHERE email = ?", [{ Kontostand: neuerKontostand }, email]);

                res.render("wallet", {
                    message7: "Auszahlung erfolgreich!!"
                }) //Auszahlung wird durchgeführt falls die Werte überein stimmen 

                db.query("SELECT crypto FROM user WHERE email = ?", [email], function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    var auszahlen_crypto = result[0].crypto;
                    var datum = new Date();
                    db.query('INSERT INTO transaction SET ?', { sender: auszahlen_crypto, receiver: auszahlen_crypto, amount: amountMining, date: datum, info: "Auszahlen" });

                }); //Werte werden in der Datenbank angepasst
            })
            res.status(200).redirect("../wallet");
        }
        else {
            res.render("wallet", {
                message8: "Sie haben nicht so viel gemint!!"
            })
        }


    })

}

