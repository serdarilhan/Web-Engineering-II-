<!-- include jquery and socket IO -->
<script src="js/jquery.js"></script>
<script src="js/socket.io.js"></script>

<script src="https://cdn.socket.io/3.1.3/socket.io.min.js" integrity="sha384-cPwlPLvBTa3sKAgddT6krw0cJat7egBga3DJepJyrLl4Q9/5WLra3rrnMcyTyOnh" crossorigin="anonymous"></script>
<script
  src="https://code.jquery.com/jquery-3.6.0.js"
  integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk="
  crossorigin="anonymous"></script>
 
<script>
  // creating io instance
  var io = io("http://localhost:8080");
 
  var receiver = "";
  var sender = "";
 
</script>


<form onsubmit="return enterName();">
  <input id="name" placeholder="Enter name">
  <input type="submit">
</form>
 
<ul id="users"></ul>
     
<script>
    function enterName() {
        // get username
        var name = document.getElementById("name").value;
 
        // send it to server
        io.emit("user_connected", name);
 
        // save my name in global variable
        sender = name;
 
        // prevent the form from submitting
        return false;
    }
 
    // listen from server
    io.on("user_connected", function (username) {
        var html = "";
        html += "<li><button onclick='onUserSelected(this.innerHTML);'>" + username + "</button></li>";
 
        document.getElementById("users").innerHTML += html;
    });
 
    function onUserSelected(username) {
        // save selected user in global variable
        receiver = username;
      }
</script>


<form onsubmit="return sendMessage();">
  <input id="message" placeholder="Enter message">
  <input type="submit">
</form>
 
<ul id="messages"></ul>
     
<script>
    function sendMessage() {
        // get message
        var message = document.getElementById("message").value;
 
        // send message to server
        io.emit("send_message", {
          sender: sender,
          receiver: receiver,
          message: message
        });
 
        // append your own message
        var html = "";
        html += "<li>You said: " + message + "</li>";
 
        document.getElementById("messages").innerHTML += html;
 
        // prevent form from submitting
        return false;
    }
 
    // listen from server
    io.on("new_message", function (data) {
        var html = "";
        html += "<li>" + data.sender + " says: " + data.message + "</li>";
 
        document.getElementById("messages").innerHTML += html;
    });
</script>


