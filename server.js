const express = require('express');
const mysql = require('mysql2');
const dbConnect = require("./config/connection")

const PORT = process.env.PORT || 3001;
const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
