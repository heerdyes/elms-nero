const express   = require('express');
const oracledb  = require('oracledb');
const app       = express();
const port      = 5000;

app.listen(port, () => {
  console.log(`elms server listening on port ${port}`);
});

app.get('/api', (req, res) => {
  res.send({
    'mdjs': 'this is the express backend!'
  });
});

