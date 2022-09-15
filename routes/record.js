const { response } = require("express");
const express = require("express");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
 
// This section will help you get a list of all the records.
recordRoutes.route("/record/meals").get(function (req, res) {
  let db_connect = dbo.getDb();
  db_connect
    .collection("Meals")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
 });
recordRoutes.route("/record/meals/:sort").get(function (req, res) {
 let db_connect = dbo.getDb();
 const query={[req.params.sort]:req.query.ascending}
 db_connect
   .collection("Meals")
   .find({})
   .sort(query)
   .toArray(function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});
 
// This section will help you get a single record by id
// recordRoutes.route("/record/meal/:id").get(function (req, res) {
//  let db_connect = dbo.getDb();
//  let myquery = { _id: ObjectId(req.params.id) };
//  db_connect
//    .collection("Meals")
//    .findOne(myquery, function (err, result) {
//      if (err) throw err;
//      res.json(result);
//    });
// });

recordRoutes.route("/record/orders").post((req,response)=>{
  let db_connect = dbo.getDb();
  let myObj = {
    name:req.body.name,
    phone:req.body.phone,
    location:req.body.location,
    basket:req.body.basket,
    grand_total:req.body.grand_total
  }
  db_connect.collection("Orders").insertOne(myObj,(err,res)=>{
    if(err) throw err;
    response.json(res)
  })
})
recordRoutes.route("/record/orders").get((req,response)=>{
  let db_connect = dbo.getDb();
  db_connect
    .collection("Orders")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      response.json(result);
    });
})
recordRoutes.route("/record/orders/:id").get((req,response)=>{
  let db_connect =dbo.getDb()
  let query = {_id : ObjectId( req.params.id)}
  db_connect.collection("Orders").findOne(query,(err,res)=>{
    if (err) throw err
    response.json({...res,timeStamp:query._id.getTimestamp().toString()})
  })
})

recordRoutes.route("/record/reservations").post((req,response)=>{
  let db_connect = dbo.getDb();
  let myObj = {
    name:req.body.name,
    phone:req.body.phone,
    date:new Date(`${req.body.date}T${req.body.time}`),
    tables:req.body.tables,
    grand_total:req.body.grand_total
  }
  db_connect.collection("Reservations").insertOne(myObj,(err,res)=>{
    if(err) throw err;
    response.json(res)
  })
})
recordRoutes.route("/record/reservations").get((req,response)=>{
  let db_connect = dbo.getDb();
  db_connect
    .collection("Reservations")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      response.json(result);
    });
})
recordRoutes.route("/record/reservations/:id").get((req,response)=>{
  let db_connect =dbo.getDb()
  let query = {_id : ObjectId( req.params.id)}
  db_connect.collection("Reservations").findOne(query,(err,res)=>{
    if (err) throw err
    response.json(res)
  })
})
// Signup section
// recordRoutes.route("/record/signup").post((req,response)=>{
//   let db_connect=dbo.getDb()
//   let myObj = {
//     username:req.body.name,
//     password:req.body.pass
//   }
//   db_connect.collection("Users").insertOne(myObj,(err,res)=>{
//     if(err) throw err;
//     response.json(res)

//   })
// })
// recordRoutes.route("/record/signup/:name").get((req,response)=>{
//   let db_connect=dbo.getDb()
//   let query=req.params.name
//   db_connect.collection("Users").findOne({username:query},{projection:{"username":query}},(err, result)=>{
//     if (err) throw err;
//     response.json(result)
//   })
// })
// recordRoutes.route("/record/login/:name/:pass").get((req,response)=>{
//   let db_connect=dbo.getDb()
//   let query={username:req.params.name,password:req.params.pass}
//   db_connect.collection("Users").findOne(query,{projection:{"username":query.username}},(err, result)=>{
//     if (err) throw err;
//     response.json(result)
//   })
// })
module.exports = recordRoutes;