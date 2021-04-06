const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
dotenv.config({ path : './.env'});
var bodyParser = require("body-parser");
const show = require("./controllers/auth");




const db = mysql.createConnection({
    host : process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

app.use(bodyParser.urlencoded());

app.use(function(req,res,next){
    res.setHeader("Access-Control-Allow-Orgin","*");
    next();
});

app.post("/get_messages" , function(req,result){
    var email = show.email;
    db.query("SELECT * FROM chat WHERE receiver = ('" + req.body.receiver + "') AND sender = ('" + show.email + "') AND receiver = ('" + show.email + "') AND sender = ('" + req.body.receiver + "')", function(error,message){
        result.end(JSON.stringify(message));
        console.log(result.end(JSON.stringify(message)));
    });
});

var users = [];
 
io.on("connection", function (socket) {

    console.log("User connected", socket.id);

    socket.on("user_connected", function (username) {
        users[username] = socket.id;
        io.emit("user_connected", username);
    });

    socket.on("send_message", function(data){
        var socketId = users[data.receiver];
        io.to(socketId).emit("new_message",data);
        db.query("INSERT INTO chat (sender, receiver, message) VALUES ('" + data.sender +"', '" + data.receiver +"', '" + data.message +"')", function(error,result){

        });
    });
});


const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended: false}));
app.use (express.json());
app.use(cookieParser());

app.set("view engine" , "hbs");



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


http.listen(8080,() => {
    console.log("Server is on fleek")
});


