const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
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
      //Creating an object with the users data
      const subscribingUser = {
        firstName: fN,
        lastName: lN,
        email: Email_
      }
      //Uploading the data to the server
      async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
          email_address: subscribingUser.email,
          status: "subscribed",
          merge_fields: {
            FNAME: subscribingUser.firstName,
            LNAME: subscribingUser.lastName
          }
        });
        if (response.statusCode === 200) {
          //If all goes well logging the contact's id
          res.sendFile(__dirname + "/success.html")
          console.log(
            `Successfully added contact as an audience member. The contact's id is ${
          response.id   }.`);
        } else {
          res.sendFile(__dirname + "/failure.html")
        }

      }});

    //API Key
    //8148fbd1a926311f0a75799f5e314c13-us20

    //Unique id
    //8e142a08a4
