const matter = require("gray-matter");

function createPaperPostPlugin() {
  return paperPostPlugin;

  function paperPostPlugin(files, metalsmith) {
    Object.keys(files).forEach(filename => {
      const file = files[filename];

      if (!file.paper) {
        return;
      }

      // Ignore first line (FIXME: Find a better way to do this)
      const contentsSansTitle = file.contents
        .replace(/^#.*$/m, "")
        // Paper turns `---` into this multidash disaster
        .replace(/----------/g, "---")
        .trim();

      const parsedMatter = matter(contentsSansTitle);
      Object.assign(file, parsedMatter.data);
      file.contents = parsedMatter.content;
    });
  }
}

module.exports = createPaperPostPlugin;
