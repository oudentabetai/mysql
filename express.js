const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const port = 8000;

const app = express();
app.use(express.json());
app.use(cors());

const con = mysql.createConnection({
  host: "localhost",
  user: "js",
  password: "",
  database: "currency",
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected");
});

// GETリクエストテスト用
app.get("/", (req, res) => {
  return res.json("hello express");
});

con.query("SELECT * from data;", function (err, rows, fields) {
    if (err) {
      console.log("SELECT err: " + err);
    }
    //log
    console.log("database data: ");
    for (let i = 0; i < rows.length; i++) {
      console.log(
        `-- id: ${rows[i].id}, name: ${rows[i].name}, amount: ${rows[i].amount}`
      );
    }
    console.log("\n");
  
    con.end((err) => {
      if (err) {
        console.error("Error ending the connection: " + err);
      } else {
        console.log("Connection closed successfully.");
      }
    });
  });

// mysqlからデータを取得して表示させる
app.get("/sql-data", (req, res) => {
  const sql = "select * from data";

  // con.query()でsql文を実行して結果をresultに格納する
  con.query(sql, (err, result) => {
    // エラーが発生した場合はエラーメッセージを返す
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    // エラーが発生しなかった場合はsql文で取得したデータを返す
    return res.json(result);
  });
});

// ~~~~~追加はここまで~~~~~

//portを開く
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
