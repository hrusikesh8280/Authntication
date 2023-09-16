const mysql = require("mysql");

const dbConfig = {
  host: "localhost",
  user: "newuser",
  password: "Bapun@8280",
  database: "myappdb"
};

const db = mysql.createConnection(dbConfig);

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

module.exports = db;
