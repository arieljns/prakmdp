//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
var fs= require('fs');
const https= require("https");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//database
mongoose.connect("mongodb+srv://arieljns1:younglex12@cluster0.nfel7.mongodb.net/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

// post.deleteOne({title: "ariel ganteng" }, function(error){
//   if(error){
//     console.log(error);
//   }else{
//     console.log('succsesfully deleted item');
//   }
// })

//home route
app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});


//untuk merender compose
app.get("/compose", function(req, res){
  res.render("compose");
});

//API
app.get("/account", function(req, res){
  res.render("account");
});
app.post("/account", function(req,res){
    
  const firstName= req.body.fName;
  const lastName=req.body.lName;
  const email=req.body.email;

  var data= {
      members: [
          {
              email_address: email,
              status: "subscribed",
              merger_fields:{
                  FNAME: firstName,
                  LNAME: lastName,
                  EMAIL: email,
              }
          }
      ]
  }
  var jsonData = JSON.stringify(data);


  const url= "https://us7.api.mailchimp.com/3.0/lists/684b34ca73";

  const options={
      method:"POST",
      auth: "ariel1:c54122374396e10532b2d8e7a7d5bb2f-us7"
  }

  //https
  const request=https.request(url, options, function(response){
      response.on("data",function(data){
          console.log(JSON.parse(data));
      })
  });
  request.write(jsonData);
  request.end();
});


//untuk post compose
app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });




  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});


//untuk merender subscribe 
app.get("/subscribe", function(req, res){
  res.render("subscribe" , null , function(error){
    if(error){
      console.log(error);
    }else{
      console.log("sucsessfully started");
    }
  });
});

//untuk merender about 
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

//untuk merender contact
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

// let port= process.env.PORT;
// if (port == null || port ==""){
//   port= 3000;
// }
// app.listen(port);

app.listen(3000, function() {
  console.log("Server started ");
});


//user arieljns1
//password  younglex1223e

//link mongo
//mongo "mongodb+srv://cluster0.nfel7.mongodb.net/myFirstDatabase" --username arieljns1