// const fs = require('fs')
// const https = require('https')

// const privateKey  = fs.readFileSync('./ssl/server.key', 'utf8');
// const certificate = fs.readFileSync('./ssl/server.crt', 'utf8');

// const credentials = {key: privateKey, cert: certificate}
const express = require('express');
require('dotenv').config();
require('./mongo');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema');
var bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
let port = 3100;

app.use(cors());

app.use(bodyParser.json());

app.use('/graphql',
    (req,res, next)=>{console.log("REQ ",req.body); next();},
    graphqlHTTP({
      schema: schema,
      graphiql: true,
    }),
  );

app.use('/api',require("./routes"));

app.listen(port);

// const httpsServer = https.createServer(credentials, app)

// httpsServer.listen(port)

console.log('API server running at localhost: ' + port);

