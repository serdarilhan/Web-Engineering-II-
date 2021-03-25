const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
//const handlebars = require('express-handlebars');

dotenv.config({ path : './.env'});

const app = express();


const db = mysql.createConnection({
    host : process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended: false}));
app.use (express.json());
app.use(cookieParser());

app.set("view engine" , "hbs");
//app.engine('handlebars', handlebars({
  //  layoutsDir: __dirname + '/views',
    //extname: "hbs"
   // }));


db.connect((error)=>{
    if(error){
        console.log(error)
    }
    else {
        console.log("Datenbank ist verbunden !!!")
    }
})


app.use("/",require("./routes/pages"));
app.use("/auth", require("./routes/auth"));
app.use("/walletBackend" ,require("./routes/walletBackend"));
app.use("/accDelete" , require("./routes/accDelete"));


app.listen(8080,() => {
    console.log("Server is on fleek")
});


