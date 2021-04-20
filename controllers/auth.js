// const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");


const OrmUser = require("../models/userorm");
OrmUser.sequelize.sync().then((req) => {
    console.log("Orm amk");
})


// const db = mysql.createConnection({
//     host: process.env.DATABASE_HOST,
//     user: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE
// });


exports.index = (req, res) => {
    console.log(req.body);


    const { name, email, passwort, passwortWiederholen } = req.body;

    user.create({
        name: "test",
        email: "asjhfsdj",
        passwort: "djgdf",
        passwortWiederholen: "hdsjfas",
    }).catch((err) => {
        if (err) {
            console.log(err);
        }
    })

    // db.query('SELECT email FROM user WHERE email = ?', [email], async (error, results) => {
    //     if (error) {
    //         console.log(error);
    //     }
    //     if (results.length > 0) {
    //         return res.render("index", {
    //             message: " Email schon vergeben"
    //         })
    //     } else if (passwort !== passwortWiederholen) {
    //         return res.render("index", {
    //             message: "Passwort stimmt nicht überein!"
    //         })
    //     } else {
    //         var kontostand = 100;
    //         var mining = 0;
    //         let hashedPasswort = await bcrypt.hash(passwort, 8);
    //         console.log(hashedPasswort);
    //         const current_date = (new Date()).valueOf().toString();
    //         const random = Math.random().toString();
    //         const cryptoHashed = crypto.createHash('sha256').update(current_date + random).digest('hex');
    //         console.log(cryptoHashed);
    
    //         db.query("INSERT INTO user SET ? ", { name: name, email: email, passwort: hashedPasswort, crypto: cryptoHashed, kontostand: kontostand, mining : mining }, (error, results) => {
    //             if (error) {
    //                 console.log(error);
    //             }
    //             else {
    //                 console.log(results);
    //                 return res.render("index", {
    //                     message: "User ist regestriert"
    
    //                 })
    
    //             }
    
    //         })
    
    //      res.status(200).redirect("../login");
    //     }
    // });


}

exports.login = async (req, res) => {
    try {
        var { email, passwort } = req.body;

        if (!email || !passwort) {
            return res.status(401).render('login', {
                message: "Schauen Sie noch einmal!"
            })
        }

        // db.query("SELECT * FROM user WHERE email = ?", [email], async (error, results) => {
        //     console.log(results);
        //     if (!results || !(await bcrypt.compare(passwort, results[0].passwort))) {
        //         res.status(401).render("login", {
        //             message: "Email oder Passwort ist nicht korrekt!!!"
        //         })
        //     } else {
        //         const id = results[0].id;
        //         const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
        //             expiresIn: process.env.JWT_EXPIRES_IN
        //         });
        //         console.log("Token ist:" + token);
        //         const cookieoptions = {
        //             expires: new Date(
        //                 Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        //             ),
        //             httpOnly: true
        //         }
        //         res.cookie("jwt", token, cookieoptions);
        //         res.status(200).redirect("../home");
        //     }
        //     exports.email = email;
        // })  
        
        
       
    }
    catch (error) {
        console.log(error);
    }
}

exports.logout = (req, res) => {
    res.clearCookie('jwt');
    res.status(200).redirect("../login");
}


