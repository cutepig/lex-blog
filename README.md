# Lex Blog

Static blogsite generator with integration to Dropbox Paper.

## Get started

Install dependencies:

```bash
$ npm install
```

Configure [environment variables](#environment-variables):

```bash
export DROPBOX_AUTH_TOKEN="xxxxxxx"
export PAPER_FOLDER_PATH="Path To My/Posts"
```

Start development build monitors:

```bash
$ npm start
```

Build the site:

```bash
$ npm build
```

## Environment variables

- `DROPBOX_AUTH_TOKEN`: Auth token for dropbox. Generate one in dropbox app console.
- `PAPER_FOLDER_PATH`: Folder to blog posts in Paper. For e.g. `"My Blog/Published Posts"`.

## License

MIT License