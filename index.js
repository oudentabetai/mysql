const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "js",
  password: "",
  database: "currency",
});

con.connect((err) => {
  if (err) {
    console.error("Error: " + err.stack);
    return;
  }
  console.log("Success. Connect as id: " + con.threadId);
});

const name = "test";
const amount = 1000;

//var result = add(name, amount);
//var result = create(name)
var result = remove(name)

console.log(result)

function create(name) {
  const query = "INSERT INTO data (name, amount) VALUES (?, ?)";
  con.query(query, [name, 1000], (err, results) => {
    if (err) {
      if (err.code == "ER_DUP_ENTRY") {
        return err
      }
    }
  });
  con.query("set @n:=0;");
  con.query("update`data` set id=@n:=@n+1;");
}

function add(name, amount) {
  const query = "INSERT INTO data (name, amount) VALUES (?, ?)";
  con.query(query, [name, amount], (err, results) => {
    if (err) {
      if (err.code == "ER_DUP_ENTRY") {
        const query = "UPDATE data SET amount = amount + ? WHERE name = ?";
        con.query(query, [amount, name], (err, results) => {
          if (err) {
            console.error(err);
          }
        });
      } else {
        console.error(`${err}`);
      }
    } else {
      console.log(`Success insert: ${results}`);
    }
  });
}

function remove(name) {
  const query = "DELETE FROM data WHERE name=?;";
  con.query(query, [name]);
  con.query("set @n:=0;");
  con.query("update`data` set id=@n:=@n+1;");
}

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

// else {
//    con.query(`SELECT * from data WHERE name=(${name})`, function (err, rows) {
//        if(err) { console.error(`Error: ${err}`) };
//        return currentamount = rows[0].amount
//    });
//
//    const newamount = currentamount + aamount
//    con.query(`UPDATE data SET amount = (${newamount})`, function (err) {
//        if (err) { console.error(`Error: ${err}`) };
//    });
//}
