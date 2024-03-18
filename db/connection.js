const mongoose = require("mongoose");

const DB = process.env.DATABASE;

mongoose.connect("mongodb+srv://harsendraraj20:Lm6EAuZQLHleFVRC@cluster0.vbuvljs.mongodb.net/?retryWrites=true&w=majority",{
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then(() => console.log("Database connected"))
  .catch((error) => {
    console.log("Error:", error);
  });
