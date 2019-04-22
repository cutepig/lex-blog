const path = require("path");
const axios = require("axios");

function createPaperFolderPlugin({
  accessToken,
  paperFolderPath,
  contentPath,
  metadata
}) {
  // Initialize an instance of axios bound to Paper API
  const paperApiClient = axios.create({
    baseURL: "https://api.dropboxapi.com/2/paper",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return paperFolderPlugin;

  // Main plugin function

  async function paperFolderPlugin(files, metalsmith) {
    try {
      // TODO: Pagination

      // Fetch list of all documents
      const documentIds = await getDocuments();

      // Conditionally add each document to `files`
      for (const doc_id of documentIds) {
        // Fetch information about the documents folder
        const folderPath = await getDocumentFolderInfo(doc_id);

        if (paperFolderPath === folderPath) {
          // We have a match, add the document to `files`
          const document = await getDocument(doc_id);

          // Humm, it seems that result doesn't contain creation or modification date info
          // and there doesn't seem to be any way to get that currently.
          // **solution**: write metadata into files and parse with another plugin

          const filename = `${path.join(contentPath, doc_id)}.md`;

          const file = {
            ...metadata,
            ...document,
            title: document.paper.title,
            filename
          };

          files[filename] = file;
        }
      }
    } catch (e) {
      // console.error(e);
      throw e;
    }
  }

  // Helper functions

  async function getDocuments() {
    const res = await paperApiClient.post("/docs/list", {
      filter_by: "docs_created",
      sort_by: "modified",
      sort_order: "descending",
      limit: 100
    });

    return res.data.doc_ids;
  }

  async function getDocumentFolderInfo(doc_id) {
    const folderInfoRes = await paperApiClient.post(
      "https://api.dropboxapi.com/2/paper/docs/get_folder_info",
      {
        doc_id: doc_id
      }
    );

    return (folderInfoRes.data.folders || [])
      .map(folderInfo => folderInfo.name)
      .join("/");
  }

  async function getDocument(doc_id) {
    const documentRes = await paperApiClient.request({
      method: "POST",
      url: "/docs/download",
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Dropbox-API-Arg": JSON.stringify({
          doc_id: doc_id,
          export_format: "markdown"
        })
      }
    });

    const apiResult = JSON.parse(
      documentRes.headers["dropbox-api-result"] || {}
    );

    return {
      contents: documentRes.data,
      paper: {
        ...apiResult,
        doc_id
      }
    };
  }
}

module.exports = createPaperFolderPlugin;
