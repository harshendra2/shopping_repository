require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./db/connection");
const router = require("./Routes/userRoute");
const PORT = 4000;


// Middleware
app.use(express.json({ limit: "500mb" })); // Parse JSON bodies with increased limit
app.use(express.urlencoded({ extended: true, limit: "500mb" })); // Parse URL-encoded bodies with increased limit
app.use(cors());
app.use(router);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Internal Server Error";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    msg: errorMessage,
    stack: err.stack
  });
});

app.listen(PORT, () => {
  console.log(`Server Start at port No: ${PORT}`);
});
