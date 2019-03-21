// @see https://www.11ty.io/docs/config/
module.exports = function (eleventyConfig) {
  // Copy the `css/` directory
  // If you use a subdirectory, it’ll copy using the same directory structure.
  eleventyConfig.addPassthroughCopy("src/site/css");

  return {
    dir: {
      input: "src/site",
      output: "dist",
      // includes: "_layouts", // Relative to `input`. Path for templates, include/extends files, partials or macros
      // layouts: "_layouts", // If layouts are elsewhere than in `includes`. Relative to `input`
      // data: "", // @see https://www.11ty.io/docs/data-global/, relative to `input`
    },
    // dataTemplateEngine: "liquid", // Markdown engine, @see https://www.11ty.io/docs/languages/
    // htmlTemplateEngine: "liquid", // HTML engine, @see https://www.11ty.io/docs/languages/
    // templateFormats: "html,liquid,ejs,md,hbs,mustache,haml,pug,njk", // Specify which types of templates should be transformed.

    passthroughFileCopy: true,
  };
}