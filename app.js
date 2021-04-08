const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require("mongoose");
const homeStartingContent = "Start contributing to the blog by clickng on COMPOSE. Later on you will be able to update and delete blog posts by accessing posts through this same home page.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

mongoose.connect("mongodb+srv://vinnie:qwertyuiop@cluster0.6usfn.mongodb.net/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postsSchema = ({
  "title": {
    type: String,
    required: true,
  },
  "content": {
    type: String,
  }
});

const post = mongoose.model("Post", postsSchema);



// post.insertOne(homeContent,function(err){
//
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log("Successfully added homeContent");
//   }
//
// });
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("static"));



app.get("/", function(req, res) {

  post.find({}, function(err, result) {
    console.log(result.length);
    // console.log(result.length);
    if (result.length == 0) {
      const home = new post({
        title: "How to Start?",
        content: homeStartingContent,
      });
      home.save();
      return res.render("home.ejs", {
        postList: [home]
      });
      // res.render("home.ejs",);
      // res.render("home.ejs",{postList:[homeStartingContent]})
    } else {
          console.log(result);
      return res.render("home.ejs", {

        postList: result
      });
    } // else if (result.length>1 & result[0].title=="How to Start?"){
    //
    // post.findByIdAndRemove()
    //
    // }

  });
  // res.render("home.ejs",{start:homeStartingContent,postList:posts});

});

app.post("/delete",function(req,res){
    title = req.body.title
    post.deleteOne({title:title},function(err){
      if(err){
        console.log(err)
      }
      else{
        console.log("Deleted "+title+" successfully!" );
      }
    });
    res.redirect("/")

});

app.get("/about", function(req, res) {

  res.render("about.ejs", {
    aboutContent: aboutContent
  });

});

app.get("/contact", function(req, res) {

  res.render("contact.ejs", {
    contactContent: contactContent
  });

});

app.get("/compose", function(req, res) {

  res.render("compose.ejs");

});

app.get("/posts/:postName", function(req, res) {

  const requestedTitle = _.lowerCase(req.params.postName);
  console.log(requestedTitle);
  post.find({}, function(err, result) {

      result.forEach(function(post) {
          var storedTitle = _.lowerCase(post.title);
          console.log("2" + storedTitle);
          if (storedTitle === requestedTitle) {
            console.log(storedTitle + "=" + requestedTitle);
            return res.render("post.ejs", {
              title: post.title,
              content: post.content,
            });


          }
          else{
            
          }
      });

  });

});

app.post("/compose", function(req, res) {

  const title = req.body.title
  const content = req.body.content
  console.log("this is content"+content)
  // const filter = {title:title};
  // const update = {content: content};
  //
  //  post.findOneAndUpdate(filter,update,{
  //   new:true,
  //   upsert:true,
  // });
  post.find({title:title},function(err,result){

    if(result.length==0){
      const newPost = new post({
        content: content,
        title: title,
      });

      newPost.save();
    }
    else{
        post.updateOne({title:title}, {content: content}, function(err){
          if(err){
            console.log(err);
          }
          else{
            console.log("updated")
          }
        });
        // result.content = content;
        // result.save();
    }

  });

  post.findOne({title: "How to Start?"}, function(err, result) {
    // console.log(result.id)
    if (result) {
      post.findByIdAndRemove(result.id, function(err) {});
    }



  });

  res.redirect("/")

});

app.post("/update",function(req,res){

    const title = req.body.title;
    post.findOne({title:title},function(err,result){
        console.log(result.content);
      res.render("update.ejs",{
        title:result.title,
        content:result.content,
      });
    });
    // res.render("update.ejs",{
    //   title:req.body.title;
    //   content:req.body.content
    // })

});

app.listen(process.env.PORT || 3000 , function() {

  console.log("Listening at port 3000...")

});
