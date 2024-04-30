
  //which is the website making the API requests 
  import express from "express";
  import bodyParser from "body-parser";
  import axios from "axios";

  const app = express();
  const port = 3000;
  const API_URL = "http://localhost:4000";

  app.use(express.static("public"));

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Route to render the main page
  app.get("/", async (req, res) => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      console.log(response);
      res.render("index.ejs", { posts: response.data });    
    } catch (error) {
      res.status(500).json({ message: "Error fetching posts" });
    }
  });

  // Route to render the edit page
  app.get("/new", (req, res) => {
    res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
  });

  app.get("/edit/:id", async (req, res) => {
    try {
      const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
      console.log(response.data);
      res.render("modify.ejs", {
        heading: "Edit Post",
        submit: "Update Post",
        post: response.data,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching post" });
    }
  });

  // Create a new post
  app.post("/api/posts", async (req, res) => {
    try {
      const response = await axios.post(`${API_URL}/posts`, req.body);
      console.log(response.data);
      res.redirect("/");
    } catch (error) {
      res.status(500).json({ message: "Error creating post" });
    }
  });

  // Partially update a post
  app.post("/api/posts/:id", async (req, res) => {
    console.log("called");
    try {
      const response = await axios.patch(
        `${API_URL}/posts/${req.params.id}`,
        req.body
      );
      console.log(response.data);
      res.redirect("/");
    } catch (error) {
      res.status(500).json({ message: "Error updating post" });
    }
  });

  // Delete a post
  app.get("/api/posts/delete/:id", async (req, res) => {
    try {
      await axios.delete(`${API_URL}/posts/${req.params.id}`);
      res.redirect("/");
    } catch (error) {
      res.status(500).json({ message: "Error deleting post" });
    }
  });

  app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
  });
  //working of this app
  /*1; Frontend Requests: The frontend application (HTML, CSS, JavaScript) sends requests to the server.js API.
  2: API Route Handling: server.js intercepts these requests based on their routes (e.g., /, /new, /edit/:id, etc.).
  3 :Interaction with index.js: For CRUD operations, server.js forwards these requests (along with any data) using axios to the appropriate endpoints in the other backend API (index.js).
  4:Response from index.js: index.js processes the requests, performs CRUD operations on its in-memory data store (or potentially a database in a more robust setup), and sends back responses.
  Frontend Response Handling:*/
