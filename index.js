import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override"; 

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded ({extended: true }));
app.use(methodOverride("_method")); // Allows us to override methods using the _method query parameter
// This variable is outside of any request to be able to be used in any request in the whole doc
let newPost = [];

app.get("/", (req, res) => {
    res.render("index.ejs", { posts: newPost })
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
  });

app.post("/submit", (req, res) => {
    
    let titlePost = req.body["title"];
    let blogPost = req.body["textbox"];
    // Adding the new post to the `newPost` array
    newPost.push({
        title: titlePost,
        content: blogPost,
    });

    // Redirecting back to the home page to display all posts
    res.redirect("/");
});

app.get("/edit/:index", (req, res) => {
    const postIndex = req.params.index;
    const postToEdit = newPost[postIndex];
    
    // Render a page where the user can edit the post
    res.render("edit.ejs", { post: postToEdit, index: postIndex });
  });

app.patch("/edit/:index", (req, res) => {
    const postIndex = req.params.index;
    if (postIndex < newPost.length && postIndex >= 0) {
        newPost[postIndex].title = req.body.title;
        newPost[postIndex].content = req.body.content;
        res.redirect("/");
    } else {
        res.status(404).send("Post not found");
    }
});

// Route to handle the delete request
app.post("/delete/:index", (req, res) => {
    const postIndex = req.params.index;
  
    // Remove the post only if it exists in the array
    if (postIndex >= 0 && postIndex < newPost.length) {
        newPost.splice(postIndex, 1);
      res.redirect("/");
    } else {
      res.status(404).send("Post not found");
    }
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });