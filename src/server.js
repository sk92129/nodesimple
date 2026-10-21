const path = require("node:path");
const fs = require("node:fs");
const { createApp } = require("./app");
const { createDatabase } = require("./database");

const dataDirectory = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDirectory, { recursive: true });

const db = createDatabase(path.join(dataDirectory, "catalog.sqlite"));
const app = createApp(db);
const port = Number.parseInt(process.env.PORT || "3000", 10);
const server = app.listen(port, () => {
  console.log(`Product catalog service listening on port ${port}`);
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
