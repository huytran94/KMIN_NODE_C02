import express from "express";
import { engine } from "express-handlebars";
import { pathResolve } from "./pathHandler.js";
import { readFile } from "./fileHandle.js";

// set constatnt data
const port = 3000;

// call express
const app = express();

const calculatePageUrl = (...pageItems) => pageItems.join(",");

const pagesObject = {
  [calculatePageUrl("index", "home", "")]: "index",
  contact: "contact",
  culture: "culture",
  lifestyle: "lifestyle",
  ["blog-single"]: "blog-single",
};

// set template engine
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    helpers: {
      createOrderList: function (items, options) {
        const itemsAsHtml = items.map(
          (item) => "<li>" + options.fn(item) + "</li>"
        );
        return "<ol>\n" + itemsAsHtml.join("\n") + "\n</ol>";
      },
      isZero: function (item) {
        return item === 0;
      },
      isArray: function(item) {
        return Array.isArray(item);
      },
      containOtherThumb: function (item) {
        if (Object.keys(item).includes("other")) {
          let otherItem = item["other"];
          if (Object.keys(otherItem).includes("thumbs")) {
            return true;
          }
        }

        return false;
      },
    },
  })
);
app.set("view engine", "hbs");
app.set("views", pathResolve("views"));

// set static files
app.use(express.static(pathResolve("public")));

// set render pages
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

  if (key === "blog-single") {
    const singlePostData = readFile("single-post.json", "data");
    // render blog single
    app.get(`/${key}`, (req, res) => {
      res.render(value, singlePostData);
    });

    return;
  }

  app.get(`/${key}`, (req, res) => {
    res.render(value);
  });
});

// set port
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
