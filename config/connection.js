const mysql = require("mysql2");

// establishing database connection use promise so we can away on connection
const dbConnect = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'employees_db'
    },
    console.log(`Connected to the movies_db database.`)
  ).promise();
  
module.exports = dbConnect;