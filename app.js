const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
dotenv.config({ path: './.env' });
var bodyParser = require("body-parser");
const show = require("./controllers/auth");
const { data } = require("jquery");
var email = show.email;


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

app.use(bodyParser.urlencoded());


var users = [];

// add listener for new connection
io.on("connection", function (socket) {
    // this is socket for each user
    console.log("User connected", socket.id);

    // server should listen from each client via it's socket
    socket.on("new_message", function (data) {
        
        // save message in database
        if (data.username != undefined || data.message != undefined) {
            db.query("INSERT INTO chat (sender, message) VALUES('" + data.username + "', '" + data.message + "')", function (error, result) {
                data.id = result.insertId;
                io.emit("new_message", data);
            }); 
            
        }

    });


    //attach listener to server
    socket.on("delete_message", function (messageId, data) {
        //delete from database
        db.query("DELETE FROM chat WHERE id = '" + messageId + "'", function (error, result) {
            // send event to all users
            io.emit("delete_message", messageId);
        });
        
    });

});


// client will listen from server
io.on("new_message", function (data) {
    // console.log("Server says", data);

    // server should listen from each client via it's socket
    socket.on("new_message", function (data) {
        //console.log("Client says", data);

        //save message in database
        db.query("INSERT INTO chat (sender, message) VALUES ('" + data.username + "', '" + data.message + "')", function (error, result) {
            // server will send message to all connected clients
            io.emit("new_message", {
                id: result.insertId,
                message: data
            });
        });
        
    });
});


// add headers
app.use(function (request, result, next) {
    result.setHeader("Access-Control-Allow-Origin", "*");
    next();
});



const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "hbs");



db.connect((error) => {
    if (error) {
        console.log(error)
    }
    else {
        console.log("Datenbank ist verbunden !!!")
    }
})



app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));
app.use("/walletBackend", require("./routes/walletBackend"));
app.use("/accDelete", require("./routes/accDelete"));


app.get("/get_mining", function (request, result) {
    db.query("SELECT * FROM user WHERE email = ?", [show.email], function (error, mining) {
        // return data will be in JSON format
        result.end(JSON.stringify(mining));
        console.log(mining[5]);
    });

});



// create API for get_message
app.get("/get_messages", function (request, result) {
    db.query("SELECT * FROM chat", function (error, messages) {
        // return data will be in JSON format
        result.end(JSON.stringify(messages));
        console.log(messages[1]);
    });

});


app.delete("/deleteMessages", function (req, res) {
    //res.send("hallo");
    db.query("TRUNCATE chat", function (err, result) {
        if (err) {
            console.log(err);
        }
        res.send("Alle Nachrichten gelöscht: " + result);
    })
})

app.post("/addTestUser", function (req, res) {
    db.query('INSERT INTO user SET ? ', { name: "Test", email: "test@test.de", passwort: "test", crypto: "testwallet", kontostand: 100, mining : 0}, function (err, result) {
        if (err) {
            console.log(err);
        }
        res.send("Testuser angelegt. Name: Test; Email: test@test.de; Passwort: test; Crypto-Wallet: testwallet; Kontostand: 100; Mining: 0");
    })
})


app.listen(8080, '178.128.207.55', () => {
    console.log("Server is on fleek")
});