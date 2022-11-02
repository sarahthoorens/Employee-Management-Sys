const mysql = require("mysql2");


const dbConnect = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'B00tcamp',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );
  
module.exports = dbConnect;

