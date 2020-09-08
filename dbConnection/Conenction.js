const mongoose = require('mongoose')


mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true, useUnifiedTopology:true
}, (err) => {
  if(err) console.log(err);;

  console.log("Connection Successful");
});
const db = mongoose.connection;

db.on('connection', () =>{
    console.log("Database connected successfully");
} )

// db.on('error', (err) => {
//     console.log("Error connecting to the database");
//     console.log("ERR::::: " + err);
// })

module.exports = db;