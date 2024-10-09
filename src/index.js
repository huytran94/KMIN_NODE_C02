import express from "express";
import { engine } from "express-handlebars";
import { pathResolve } from "./pathHandler.js";
import { connectToDatabase } from "./configDatabase.js";
import { formatDate } from "./dateConvert.js";
import { BlogRepository } from "./utils/blogRepository.js";

// set constatnt data
const port = 3001;

// call express
const app = express();

// connect to database
const db = await connectToDatabase("blog_database", "3308");

// set static files
app.use(express.static(pathResolve("public")));
// set url encoded
app.use(express.urlencoded({ extended: true }));

// set json
app.use(express.json());

// set template engine
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    helpers: {
      // createOrderList: function (items, options) {
      //   const itemsAsHtml = items.map(
      //     (item) => "<li>" + options.fn(item) + "</li>"
      //   );
      //   return "<ol>\n" + itemsAsHtml.join("\n") + "\n</ol>";
      // },
      isZero: function (item) {
        return item === 0;
      },
      // isArray: function (item) {
      //   return Array.isArray(item);
      // },
      // containOtherThumb: function (item) {
      //   if (Object.keys(item).includes("other")) {
      //     let otherItem = item["other"];
      //     if (Object.keys(otherItem).includes("thumbs")) {
      //       return true;
      //     }
      //   }

      //   return false;
      // },
    },
  })
);
app.set("view engine", "hbs");
app.set("views", pathResolve("views"));

// create blog repository
const blogRepo = new BlogRepository(db);
// set render pages
const calculatePageUrl = (...pageItems) => pageItems.join(",");

const pagesObject = {
  "/": "index",
  contact: "contact",
  culture: "culture",
  lifestyle: "lifestyle",
  ["blog-single"]: "blog-single",
  createBlog: "createBlog",
};

Object.entries(pagesObject).forEach(([key, value]) => {
  // check if page exists
  if (!value) {
    console.log(`Page ${key} not found`);
    return;
  }
  // check if url is multiple
  if (key.includes(",")) {
    let urlSplit = key.split(",");
    urlSplit.forEach((page) => {
      app.get(`/${page.trim()}`, (req, res) => {
        res.render(value);
      });
    });
  }

  if (key === "/") {
    app.get(`/`, async (req, res) => {
      const result = await blogRepo.getBlogs();
      // modify date data
      result.map((item) => {
        item.createdDate = formatDate(item.createdDate);
      });

      // get posts
      let featuredPosts = result.splice(0, 4);
      let singlePost = result.splice(0, 1);
      let highlightPost = result.splice(0, 4);
      let finalPost = result;
      res.render("index", {
        featuredFistItem: featuredPosts[0],
        featuredRemainItems: featuredPosts.splice(1),
        singlePost: singlePost[0],
        highlightPostFistCol: highlightPost.splice(0, 2),
        highlightPostSecondCol: highlightPost,
        finalPost: finalPost[0],
      });
    });
  }

  if (key === "blog-single") {
    app.get(`/${key}`, async (req, res) => {
      const result = await blogRepo.getSingleBlog();
      if (result[0].length > 0) {
        // modify date data
        result[0][0].createdDate = formatDate(result[0][0].createdDate);
        
        // render
        res.render(value, { singlePost: result[0][0] });

        return;
      }
    });
  }

  app.get(`/${key}`, (req, res) => {
    res.render(value);
  });

});

// handle create blogs
app.post("/blogs", async (req, res) => {
  console.log(req.body)
  const result = await blogRepo.createBlog(req.body);
  if (result.affectedRows === 0) {
    res.status(400).send({
      message: "Failed to insert data",
    });
    return;
  }

  res.status(201).send({
    message: "New blog item is inserted successfully",
  });
});

// set port
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
