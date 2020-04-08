var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bosyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bosyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost:27017/blog_app",{useNewUrlParser: true});


const localhost ="127.0.0.1";
const port = 4000;

var blogSchema = new mongoose.Schema({
    name: String,
    image: String,
    blog: String,
    dateCreated: {type: String, default: Date.now()}
});

var Blog = mongoose.model("Blog",blogSchema);


app.get("/",function(req,res){
    res.redirect("/blog");
})

//INDEX ROUTE
app.get("/blog", function(req, res){
    Blog.find({},function(err,blog){
        if(err){
            console.log(err)
        }else{
            res.render("index",{blog: blog});
        }
    })
})

//NEW ROUTE
app.get("/blog/new",function(req,res){
    res.render("new");
})

//SHOW ROUTE
app.get("/blog/:id",function(req,res){
    Blog.findById(req.params.id,function(err, foundBlog){
        if(err){
            console.log(err);
        }
        else{
            res.render("show",{foundBlog: foundBlog});
        }
    })
})

//EDIT ROUTE
app.get("/blog/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        }else{
            res.render("edit",{foundBlog: foundBlog});
        }
    })
    
})
 
//UPDATE ROUTE
app.put("/blog/:id",function(req,res){
    req.body.blog.blog=req.sanitize(req.body.blog.blog);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err,updatedBlog){
        if(err){
            res.redirect("/blog");
        }else{
            res.redirect("/blog/" + req.params.id);
        }
    })
})

//DELETE ROUTE
app.delete("/blog/:id",function(req,res){
    Blog.findByIdAndDelete(req.params.id,function(err, deleteBlog){
        if(err){
            res.redirect("/blog");
        }else{
            res.redirect("/blog");
            console.log("BLOG DELETED");
        }
    })
})

//CREATE ROUTE
app.post("/blog",function(req,res){
    req.body.blog.blog=req.sanitize(req.body.blog.blog);
    Blog.create(req.body.blog.blog,function(err,data){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blog");
        }
    })
})

app.listen(port, localhost, function(){
    console.log("SERVER IS LISTENING");
})