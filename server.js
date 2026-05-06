const express = require("express");
const bodyParser = require("body-parser");
const bankingRoutes = require("./routes/banking");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/api", bankingRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});