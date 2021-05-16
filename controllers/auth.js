const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const t = require("../controllers/walletBackend");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



const db = mysql.createConnection({ //Datenbank verbindung mit mysql
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


exports.index = (req, res) => {
    
    //ALTER CODE OHNE ORM FÜR DIE DATENBANK


    /*    const emailVergeben = user.findAll({where: {email: email}}).then((req)=>{}).catch((err) => {if (err) {console.log(err);}});
     */ //  const emailVergeben =  db.sequelize.query("SELECT email FROM user");
    //console.log(emailVergeben);

    /*     if (emailVergeben > 0) {
            return res.render("index", {
                message: " Email schon vergeben"
            })
        } else if (passwort !== passwortWiederholen) {
            return res.render("index", {
                message: "Passwort stimmt nicht überein!"
            })
        } else { */
    /* db.sequelize.sync().then((req)=>{  */


    //   });
    //}
    const { name, email, passwort, passwortWiederholen } = req.body;

    async function register() { //Regestrieren 
        const emailprisma = await prisma.$queryRaw('SELECT email FROM user WHERE email = ?', email);
        console.log(emailprisma);
        if (emailprisma.length >= 1) {
            return res.render("index", {
                message: " Email schon vergeben"   //Abfrage ob die Email existiert 
            })
        } else if (passwort !== passwortWiederholen) {
            return res.render("index", {
                message: "Passwort stimmt nicht überein!" //Das Passwort wiederholen
            })
        } else {
            var kontostand = 100;
            var mining = 0;
            let hashedPasswort = await bcrypt.hash(passwort, 8); //Passwort mit bycrpt hashen 
            console.log(hashedPasswort);
            const current_date = (new Date()).valueOf().toString(); //Datum erzeugen
            const random = Math.random().toString();
            const cryptoHashed = crypto.createHash('sha256').update(current_date + random).digest('hex'); //crypto-adresse erzeugen
            console.log(cryptoHashed);

            await prisma.user.create({ //User wird regestriert mit einem Start Kontostand von 100 Coins
                data: {
                    name: name,
                    email: email,
                    passwort: hashedPasswort,
                    crypto: cryptoHashed,
                    kontostand: 100,
                    mining: 0,
                },
            })
            res.status(200).redirect("../login");
        }
    }
    register();

}

exports.login = async (req, res) => {
    try {

        var { email, passwort } = req.body;

        async function login() { //Login
            const emailvorhanden = await prisma.$queryRaw('SELECT email FROM user WHERE email = ?', email);
            if (emailvorhanden.length >= 1) {
                const emailprisma = await prisma.$queryRaw('SELECT * FROM user WHERE email = ?', email);
                console.log("Passwort: " + emailprisma[0].passwort);

                if (!emailprisma || !(await bcrypt.compare(passwort, emailprisma[0].passwort))) {
                    res.status(401).render("login", {
                        message: "Email oder Passwort ist nicht korrekt!!!" //Falls Email oder Passwort nicht korrekt ist
                    })
                } else {
                    const id = emailprisma[0].id;
                    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN //JSON Web-token wird erstellt über JWT
                    });
                    console.log("Token ist: " + token);
                    const cookieoptions = {
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true
                    }
                    res.cookie("jwt", token, cookieoptions);
                    res.status(200).redirect("../home");
                    //res.send("jwt: " + token);
                }
                return email;
            } else {
                console.log("E-Mail nicht vorhanden");
                res.redirect("/login");
            }

            
        }
        function stop() { 
            clearInterval(t.t) 
        };
        
        stop();
        login();
        exports.email = email;
    } catch (error) {
        console.log(error);
    }
}

exports.logout = (req, res) => { //Logout der Web-token wird gelöscht

    function stop() { 
        clearInterval(t.t) 
    };
    
    stop();
    res.clearCookie('jwt');
    res.status(200).redirect("../login");
}
