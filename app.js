const express = require("express");
const path = require("path");
// const mysql = require("mysql");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
dotenv.config({ path: './.env' });
var bodyParser = require("body-parser");
const show = require("./controllers/auth");
const { data } = require("jquery");


// const db = mysql.createConnection({
//     host: process.env.DATABASE_HOST,
//     user: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE
// });

// app.use(bodyParser.urlencoded());






app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Orgin", "*");
    next();
});


var users = [];

// add listener for new connection
io.on("connection", function (socket) {
    // this is socket for each user
    console.log("User connected", socket.id);

    // server should listen from each client via it's socket
    socket.on("new_message", function (data) {

        // save message in database
        if (data.username != undefined || data.message != undefined) {
            // db.query("INSERT INTO chat (sender, message) VALUES('" + data.username + "', '" + data.message + "')", function (error, result) {
            //     data.id = result.insertId;
            //     io.emit("new_message", data);
            // }); 
            chat.create({
                sender: data.username,
                message: data.message,
            }).catch((err) => {
                if (err) {
                    console.log(err);
                }
            })
        }

    });


    //attach listener to server
    socket.on("delete_message", function (messageId, data) {
        // delete from database
        // db.query("DELETE FROM chat WHERE id = '" + messageId + "'", function (error, result) {
        //     // send event to all users
        //     io.emit("delete_message", messageId);
        // });
        chat.create({
            sender: "",
            message: "",
        }).catch((err) => {
            if (err) {
                console.log(err);
            }
        })
    });

});


// client will listen from server
io.on("new_message", function (data) {
    // console.log("Server says", data);

    // server should listen from each client via it's socket
    socket.on("new_message", function (data) {
        // console.log("Client says", data);

        // save message in database
        // db.query("INSERT INTO chat (sender, message) VALUES ('" + data.username + "', '" + data.message + "')", function (error, result) {
        //     // server will send message to all connected clients
        //     io.emit("new_message", {
        //         id: result.insertId,
        //         message: data
        //     });
        // });
        chat.create({
            sender: "",
            message: "",
        }).catch((err) => {
            if (err) {
                console.log(err);
            }
        })
    });
});


// add headers
app.use(function (request, result, next) {
    result.setHeader("Access-Control-Allow-Origin", "*");
    next();
});


// create API for get_message
app.get("/get_messages", function (request, result) {
    // db.query("SELECT * FROM chat", function (error, messages) {
    //     // return data will be in JSON format
    //     result.end(JSON.stringify(messages));
    //     console.log(messages[1]);
    // });
    chat.create({
        sender: "",
        message: "",
    }).catch((err) => {
        if (err) {
            console.log(err);
        }
    })
});




const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "hbs");



// db.connect((error) => {
//     if (error) {
//         console.log(error)
//     }
//     else {
//         console.log("Datenbank ist verbunden !!!")
//     }
// })

const OrmChat = require("./models/chatorm");
OrmChat.sequelize.sync().then((req) => {
    console.log("Orm");
})


app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));
app.use("/walletBackend", require("./routes/walletBackend"));
app.use("/accDelete", require("./routes/accDelete"));


http.listen(8080, () => {
    console.log("Server is on fleek")
});

