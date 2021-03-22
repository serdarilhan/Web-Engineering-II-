const mysql = require("mysql");
const show = require("../controllers/auth");

const db = mysql.createConnection({
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

    console.log(amount);


    db.query("SELECT crypto FROM user WHERE email = ? ", [email], function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log(result);
        var loggedInCrypto = result[0].crypto;
        if (result[0].crypto == adresse) {
            console.log("Fehler es ist ihre Adresse!!!");
        } else {
            db.query("SELECT kontostand FROM user WHERE email = ?", [email], function (err, result) {
                if (err) {
                    console.log(err);
                }
                var max_send_money = result[0].kontostand;
                console.log(max_send_money);

                if (amount > max_send_money) {
                    console.log("Sie haben zu wenige Coins!!!");
                } else {
                    db.query("SELECT kontostand FROM user WHERE crypto = ?", adresse, function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        var kontostand = result[0].kontostand;
                        var neuerKontostand = kontostand + amount;
                        var neuerKontostandSender = max_send_money - amount;

                        var datum = new Date();
                        
                        db.query('UPDATE user SET ? WHERE crypto = ?', [{ kontostand: neuerKontostand }, adresse]);
                        db.query('UPDATE user SET ? WHERE email = ?', [{ kontostand: neuerKontostandSender }, email]);
                        db.query('INSERT INTO transaction SET ?', { sender: loggedInCrypto, receiver: adresse, amount: amount, date: datum , info : "Transaction" });

                    })
                }
            })
        }
    });

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
            console.log(neuMining);
            console.log(max_send_money);
            var neuerKontostandUser = max_send_money - amountMining;
          

            if (amountMining > max_send_money) {
                console.log("Sie haben zu wenige Coins!!!");
            } else {
                db.query('UPDATE user SET ? WHERE email = ?', [{ mining: neuMining }, email]);
                db.query('UPDATE user SET ? WHERE email = ?', [{ kontostand: neuerKontostandUser }, email]);

                var count = neuMining;
                let max = 1.2575* neuMining;
                function counter() {
                    if (count <= max) {
                    count = count + 0.1;
                    console.log(count);
                    db.query("UPDATE user SET ? WHERE email = ?", [{mining : count}, email]);
                    }
                }
                setInterval(counter, 10000);

                db.query("SELECT crypto FROM user WHERE email = ?", [email] , function (err,result) {
                    if(err){
                        console.log(err);
                    }
                    var mining_crypto = result[0].crypto;
                    var datum = new Date();
                     db.query('INSERT INTO transaction SET ?', { sender: mining_crypto, receiver: mining_crypto, amount: amountMining, date: datum, info : "Mining"});
                });
    
                
                
            }
        })


    })
}
exports.auszahlen = (req, res) => {
    var amountAuszahlen = req.body.auszahlen;
    var amountMining = parseFloat(amountAuszahlen);
    var email = show.email;
    

    db.query("SELECT mining FROM user WHERE email = ?" , [email] , function (err,result){
        if(err){
            console.log(err);
        }
        
        if(amountMining <= result[0].mining){
            var neuesMining = result[0].mining - amountMining;
        
            db.query("SELECT kontostand FROM user WHERE email = ?", [email], function (err, result){
                if(err){
                    console.log(err);
                }
                var kontostand = result[0].kontostand;
                console.log(kontostand);
                var neuerKontostand = kontostand + amountMining;
                console.log(neuerKontostand);
                db.query("UPDATE user SET ? WHERE email = ?", [{mining : neuesMining}, email]);
                db.query("UPDATE user SET ? WHERE email = ?", [{Kontostand : neuerKontostand}, email]);

                db.query("SELECT crypto FROM user WHERE email = ?", [email] , function (err,result) {
                    if(err){
                        console.log(err);
                    }
                    var auszahlen_crypto = result[0].crypto;
                    var datum = new Date();
                     db.query('INSERT INTO transaction SET ?', { sender: auszahlen_crypto, receiver: auszahlen_crypto, amount: amountMining, date: datum ,info: "Auszahlen"  });
                });
            })
        }
        else{
            console.log("Sie haben nicht so viel gemint!!");
        }
      
    })

}