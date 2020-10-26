const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const Record = require('./models/record');
const mongoose = require('mongoose');

const config = {
  Tax_Year:2020,
  S_Income_1_limit:9700,
  S_Income_1_base:0.0,
  S_Income_1_tax:0.1,
  S_Income_1_over:0,
  S_Income_2_limit:39475,
  S_Income_2_base:970.0,
  S_Income_2_tax:.12,
  S_Income_2_over:9700,
  S_Income_3_limit:84200,
  S_Income_3_base:4543.0,
  S_Income_3_tax:0.22,
  S_Income_3_over:39475,
  S_Income_4_limit:160725,
  S_Income_4_base:14382.5,
  S_Income_4_tax:0.24,
  S_Income_4_over:84200,
  S_Income_5_limit:204100,
  S_Income_5_base:32748.5,
  S_Income_5_tax:0.32,
  S_Income_5_over:160725,
  S_Income_6_limit:510300,
  S_Income_6_base:46628.5,
  S_Income_6_tax:0.35,
  S_Income_6_over:204100,
  S_Income_7_base:153798.5,
  S_Income_7_tax:0.37,
  S_Income_7_over:510300,
  S_Deduction:12400,
  S_CG_Break_1_Income:40000,
  S_CG_Break_1_Tax_Rate:0,
  S_CG_Break_2_Income:44145,
  S_CG_Break_2_Tax_Rate:0.15,
  S_CG_Break_3_Tax_Rate:0.2,
  M_Income_1_limit:19400,
  M_Income_1_base:0.0,
  M_Income_1_tax:0.10,
  M_Income_1_over:0,
  M_Income_2_limit:78950,
  M_Income_2_base:1940.0,
  M_Income_2_tax:0.12,
  M_Income_2_over:19400,
  M_Income_3_limit:168400,
  M_Income_3_base:9086.0,
  M_Income_3_tax:0.22,
  M_Income_3_over:78950,
  M_Income_4_limit:321450,
  M_Income_4_base:28765.0,
  M_Income_4_tax:0.24,
  M_Income_4_over:168400,
  M_Income_5_limit:408200,
  M_Income_5_base:65487.0,
  M_Income_5_tax:0.32,
  M_Income_5_over:321450,
  M_Income_6_limit:612350,
  M_Income_6_base:93257.0,
  M_Income_6_tax:0.35,
  M_Income_6_over:408200,
  M_Income_7_base:164709.5,
  M_Income_7_tax:0.37,
  M_Income_7_over:612350,
  M_Deduction:24800,
  M_CG_Break_1_Income:80000,
  M_CG_Break_1_Tax_Rate:0,
  M_CG_Break_2_Income:496600,
  M_CG_Break_2_Tax_Rate:0.15,
  M_CG_Break_3_Tax_Rate:0.2,
}

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
  const tax_return = calculateTax(req.body.m_status, req.body.income, req.body.tax_paid);
  const record = new Record({
    email: req.body.email,
    m_status: req.body.m_status,
    income: req.body.income,
    tax_paid: req.body.tax_paid,
    tax_return: tax_return,
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

function calculateTax(m_status, income, tax_paid){




//   m_status = "SINGLE"
// income = 50000
// tax_paid = 5000

  var base_tax = 0;
  var over_amount = 0;
  var rate = 0;
  var deduction =0;

  const c = config;

  if (m_status == 'SINGLE'){
    deduction = c.S_Deduction;
    if(income <= c.S_Income_1_limit){
      base_tax = c.S_Income_1_base;
      over_amount = c.S_Income_1_over;
      rate = c.S_Income_1_tax;
    }else if(income <= c.S_Income_2_limit){
      base_tax = c.S_Income_2_base;
      over_amount = c.S_Income_2_over;
      rate = c.S_Income_2_tax;
    }else if(income <= c.S_Income_3_limit){
      base_tax = c.S_Income_3_base;
      over_amount = c.S_Income_3_over;
      rate = c.S_Income_3_tax;
    }else if (income <= c.S_Income_4_limit){
      base_tax = c.S_Income_4_base;
      over_amount = c.S_Income_4_over;
      rate = c.S_Income_4_tax;
    }else if (income <= c.S_Income_5_limit){
      base_tax = c.S_Income_5_base;
      over_amount = c.S_Income_5_over;
      rate = c.S_Income_5_tax;
    }else if (income <= c.S_Income_6_limit){
      base_tax = c.S_Income_6_base;
      over_amount = c.S_Income_6_over;
      rate = c.S_Income_6_tax;
    }else{
      base_tax = c.S_Income_7_base;
      over_amount = c.S_Income_7_over;
      rate = c.S_Income_7_tax;
    }
  }else{
    deduction = c.M_Deduction;
    if(income <= c.M_Income_1_limit){
      base_tax = c.M_Income_1_base
      over_amount = c.M_Income_1_over
      rate = c.M_Income_1_tax
    }else if(income <= c.M_Income_2_limit){
      base_tax = c.M_Income_2_base
      over_amount = c.M_Income_2_over
      rate = c.M_Income_2_tax
    }else if(income <= c.M_Income_3_limit){
      console.log("should be getting here.")
      base_tax = c.M_Income_3_base
      over_amount = c.M_Income_3_over
      rate = c.M_Income_3_tax
    }else if(income <= c.M_Income_4_limit){
      base_tax = c.M_Income_4_base
      over_amount = c.M_Income_4_over
      rate = c.M_Income_4_tax
    }else if(income <= c.M_Income_5_limit){
      base_tax = c.M_Income_5_base
      over_amount = c.M_Income_5_over
      rate = c.M_Income_5_tax
    }else if(income <= c.M_Income_6_limit){
      base_tax = c.M_Income_6_base
      over_amount = c.M_Income_6_over
      rate = c.M_Income_6_tax
    }else{
      base_tax = c.M_Income_7_base
      over_amount = c.M_Income_7_over
      rate = c.M_Income_7_tax
    }
  } 

  // var deduction = 24800;
  // var base_tax = 9086.0
  // var over_amount = 78950
  // var rate = 0.22
  // var tax_paid = 70000;
  // var income = 79000;

  const tax_due = base_tax - deduction -tax_paid + ((income - over_amount) * rate)


return tax_due;
}


