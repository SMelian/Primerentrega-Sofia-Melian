const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.end("server basic");
});

server.listen(PORT, () => {
  console.log("SERVER ONLINE", PORT);
});