const mysql = require("mysql");
const show = require("../controllers/auth");


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.accDelete = (req, res) => {

    var email = show.email;

    db.query("SELECT kontostand FROM user WHERE email = ?", [email], function (err, result) {
        if (err) {
            console.log(err);
        }
        var kontostand = result[0].kontostand;
        if (kontostand <= 100) {
            db.query("SELECT mining FROM user WHERE email = ?", [email], function (err, result) {
                if (err) {
                    console.log(err);
                }
                var mining = result[0].mining;
                if (mining == 0) {
                    db.query("DELETE FROM user WHERE email = ?", [email], function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        console.log(result);
                        res.status(200).redirect("/");
                    })
                }
                else {
                    console.log("Ihr Mining-stand muss gleich 0 sein");
                }
            })
        }
        else {
            console.log("Ihr Kontostand muss kleiner oder gleich 100 sein!!!");
        }

    })



}