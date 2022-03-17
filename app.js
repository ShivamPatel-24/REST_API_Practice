//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model('Article', articleSchema);

app.route("/articles")

.get((req, res) => {
  
  Article.find({}, (err, foundArticle) => {
    if (err) res.send(err);
    res.send(foundArticle)
  })

})

.post((req, res) => {

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  })

  newArticle.save(err => {
    if (!err) res.send("Successfully added the new article")
    else res.send(err)
  });

})

.delete((req, res) => {
  Article.deleteMany(err => {
    if (!err) res.send("Successfully deleted the articles");
  })
})



app.route("/articles/:articleTitle")

.get((req, res) => {

  Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
    if (foundArticle) {
      res.send(foundArticle);
    }
    else{
      res.send("No article with the same match found.")
    }
  })
})

.put((req, res) => {
  Article.updateOne(
    { title: req.params.articleTitle },
    { title: req.body.title, content: req.body.content }, 
    (err) => {
      if (!err) res.send("Successfully updated the article.")
    }
  );
})

.patch((req, res) => {
  Article.updateOne(
    { title: req.params.articleTitle},
    {$set: req.body},
    (err) => {
      if (!err) res.send("Successfully patched the article")
    }
  )
})

.delete((req, res) => {
  Article.deleteOne({ title: req.params.articleTitle}, err => {
      if (!err) res.send("Successfully deleted the article")
    }
  )
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});