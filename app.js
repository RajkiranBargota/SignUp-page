const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();

app.listen(process.env.PORT || 3000, function() {
  console.log("the server is listening to 3000")
});

app.use(express.static("Public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//Setting up MailChimp
mailchimp.setConfig({
  //*****************************ENTER YOUR API KEY HERE******************************
  apiKey: "8148fbd1a926311f0a75799f5e314c13-us20",
  //*****************************ENTER YOUR API KEY PREFIX HERE i.e.THE SERVER******************************
  server: "us20"
});
//As soon as the sign in button is pressed execute this
app.post("/", function(req, res) {
  var fN = req.body.FName;
  var lN = req.body.LName;
  var Email_ = req.body.Email_;
  const listId = "8e142a08a4";
  console.log(fN, lN, Email_);
  //Creating an object with the users data
  const udata = {
    firstName: fN,
    lastName: lN,
    email: Email_
  }
  //console.log(subscribingUser.email, subscribingUser.firstName, subscribingUser.lastName);

  const data = {
    members: [
      {
        email_address: Email_,
        status: "subscribed",
        merge_fields: {
          FNAME: fN,
          LNAME: lN,
        }
      }
    ]
  };

  const options = {
    method: "POST",
    auth: "Rajkiran Bargota:8148fbd1a926311f0a75799f5e314c13-us20"
  }

  const jsonData = JSON.stringify(data);
  const url = "https://us20.api.mailchimp.com/3.0/lists/8e142a08a4";

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });

  });

  request.write(jsonData);
  request.end();
});

//app.post("/failure", function(req, res) {
//  res.redirect("/")
//});



//API Key
//8148fbd1a926311f0a75799f5e314c13-us20

//Unique id
//8e142a08a4
