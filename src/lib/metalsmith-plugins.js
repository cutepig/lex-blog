const { mapValues } = require("lodash");

function dumpMetadata(outputPath) {
  return async (files, metalsmith) => {
    const _files =
      mapValues(files, file => ({
        ...file,
        contents: file.contents.toString()
      })) || {};

    _files.globalMetadata = metalsmith.metadata();

    try {
      files[outputPath] = {
        contents: JSON.stringify(_files, null, 2)
      };
    } catch (e) {
      if (!(e instanceof TypeError)) {
        throw e;
      } else {
        console.warn("*** dumpMetadata warning:");
        console.warn(e);
      }
    }
  };
}

module.exports = {
  dumpMetadata
};
