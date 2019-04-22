const path = require("path");
const Metalsmith = require("metalsmith");
const paperFolder = require("./metalsmith-paper-folder");
const paperPosts = require("./metalsmith-paper-post");
const collections = require("metalsmith-collections");
const fileMetadata = require("metalsmith-filemetadata");
const markdown = require("metalsmith-markdown");
const permalinks = require("metalsmith-permalinks");
const excerpts = require("metalsmith-excerpts");
const headings = require("metalsmith-headings");
const layouts = require("metalsmith-layouts");
const helpers = require("./template-helpers");
const { dumpMetadata } = require("./metalsmith-plugins");

const CWD = process.cwd();

const SITE_ROOT_PATH = path.join(CWD, "src/site");

const SOURCE_PATH = path.join(SITE_ROOT_PATH, "content");
const DESTINATION_PATH = path.join(CWD, "dist");

// Consider getting site root path from command line arguments
// Research if we have access to it and how to parse it

// **update**: we do, bug using the same commander as metalsmith is
// troublesome, since it uses the same instance. consider trying
// alternative command line parser that allows for separate instances

// console.log("argv", process.argv);

// I'm expecting this from
// $ metalsmith --config ./src/lib/metalsmith.js something here
/*
[ '/path/to/node',
  '/path/to/project/node_modules/metalsmith/bin/_metalsmith',
  '--config',
  './src/lib/metalsmith.js',
  'something',
  'here' ]
*/
// Note that I'd rather have:
// $ metalsmith --config ./src/lib/metalsmith.js --content-path "./content" --site-path "./src/site"

// https://metalsmith.io
Metalsmith(__dirname)
  .metadata({
    siteName: "Lex blog",
    siteUrl: "https://lexalex.net",
    description: "TODO: Placeholder lol"
  })
  .source(SOURCE_PATH)
  // NOTE: Intermediate output is still put to `./build`
  .destination(DESTINATION_PATH)
  .ignore(["_*", "_*/**/*", "**/_*", "**/_*/**/*"])
  .clean(false) // NOTE: Cleaning up happens through npm scripts
  .use(
    paperFolder({
      accessToken: process.env.DROPBOX_AUTH_TOKEN,
      paperFolderPath: process.env.PAPER_FOLDER_PATH,
      contentPath: "posts",
      metadata: {
        layout: "paperPost"
      }
    })
  )
  .use(paperPosts())
  .use(
    collections({
      // group all blog posts by internally
      // adding key 'collections':'posts'
      posts: {
        pattern: "posts/*.md",
        sortBy: "date",
        reverse: true,
        metadata: {} // or `path/to/file.json`
      }
    })
  )
  .use(fileMetadata([{ pattern: "posts/*", metadata: { layout: "post.njk" } }]))
  .use(markdown())
  .use(
    permalinks({
      pattern: ":title",
      linksets: [
        {
          match: { collection: "posts" },
          pattern: "posts/:title"
        }
      ]
    })
  )
  .use(excerpts())
  // .use(headings("h1"))
  // .use(pager...)
  .use(
    layouts({
      directory: path.join(SITE_ROOT_PATH, "_includes"),
      pattern: "**/*.html",
      engineOptions: {
        root: "",
        path: "",
        // @see https://mozilla.github.io/nunjucks/api#custom-filters
        filters: { ...helpers }, // A set of custom Nunjucks filters to add.
        // A set of Nunjucks extensions to add.
        extensions: {},
        globals: {} // A set of global variables available to all templates.
      }
    })
  )
  // .use(dumpMetadata(".metadata.json"))
  .build(error => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    console.log("Metalsmith done");
  });
