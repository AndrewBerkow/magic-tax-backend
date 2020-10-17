const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const Record = require('./models/record');
const mongoose = require('mongoose');

//Set up a connection to the online mongo database
// Note: magictaxdb in string is the database name
db_address = 'mongodb+srv://magicTaxAdmin:magictaxIPOmakesmillions@cluster0.u9t5s.mongodb.net/magictaxdb?retryWrites=true&w=majority'

mongoose.connect(db_address, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to online database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"
  );
  next();
});

app.post("/api/records", (req, res, next) => {
  console.log("hey are we getting to POST")
  console.log("req", req);
  // console.log("res", res);
  // console.log("next", next);
  const record = new Record({
    email: req.body.email,
    m_status: req.body.m_status,
    income: req.body.income,
    tax_paid: req.body.tax_paid
    });
  console.log(record);
  record.save(); //magic mongoose command to save the blog created above
  res.status(201).json({
    message: record
  });
});


app.get("/api/records", (req, res, next) => {
  console.log("hey are we getting to GET")
  Record.findOne({ 'email': req.query.email}, function (err, foundRecord) {
    res.status(200).json({
      // message: "Record fetched successfully!",
      foundRecord: foundRecord
    });
  });
});

//This catches any other requests and is good to check server is up
app.use((req, res, next) => {
  res.send('Hello from Jons Online Node Express Server! Minor chages');
});

module.exports = app;

