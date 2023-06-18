const express   = require('express');
const oracledb  = require('oracledb');
const app       = express();
const port      = 5000;

async function getusers(rq, rs) {
  let connection;
  try {
    connection   = await oracledb.getConnection();  // get a connection from the default pool
    const result = await connection.execute(`select * from users`);

    rs.json({'users': result.rows});
  } catch (err) {
    rs.json({"error": err.text});
  } finally {
    if (connection) {
      try {
        await connection.close();  // always release the connection back to the pool
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function ulogin(rq, rs) {
  let connection;
  try {
    connection   = await oracledb.getConnection();
    const result = await connection.execute(
      `BEGIN
        login_user(:unm, :pwd, :tok);
      END;`,
      {
        unm: rq.body['uname'],
        pwd: rq.body['upass'],
        tok: { dir: oracledb.BIND_OUT, type: oracledb.VARCHAR2, maxSize: 128 }
      }
    );
    rs.json({'token': result.outBinds.tok});
  } catch (err) {
    console.log(err);
    rs.json({'error': err});
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function uregister(rq, rs) {
  let connection;
  try {
    connection   = await oracledb.getConnection();
    const result = await connection.execute(
      `BEGIN
        register_user(:unm, :fnm, :lnm, :pwd, :res);
      END;`,
      {
        unm: rq.body['uname'],
        fnm: rq.body['fname'],
        lnm: rq.body['lname'],
        pwd: rq.body['upass'],
        res: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 128 }
      }
    );
    console.log(result.outBinds);
    rs.json({'res': result.outBinds.res});
  } catch (err) {
    rs.json({'error': err});
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function init() {
  try {
    // connect to db
    await oracledb.createPool({
      user          : "username",
      password      : "password",
      connectString : "localhost/freepdb1",
      poolIncrement : 0,
      poolMax       : 5,
      poolMin       : 5
    });
    console.log("created db connection pool...");
    
    app.listen(port, () => {
      console.log(`elms-nero server listening on port ${port}`);
    });
    
    // enable req body parsing
    app.use(express.json());
    
    // api endpoint handlers
    app.get ('/api/v0/users',    (req, res) => { getusers  (req, res); });
    app.post('/api/v0/login',    (req, res) => { ulogin    (req, res); });
    app.post('/api/v0/register', (req, res) => { uregister (req, res); });
    
  } catch (err) {
    console.error(err);
  }
}

init();

