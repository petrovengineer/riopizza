const {authenticateToken} = require('./routes/auth');
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

app.use('/',require("./routes"));

app.listen(port);
console.log('GraphQL API server running at localhost: ' + port);
