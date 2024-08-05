const mongoose = require("mongoose");
// connection with mongoDB

mongoose.connect(process.env.MONGODB_CONNECTION_URL).then(()=>{
    console.log("MongoDB Databse connected succesfully");
}).catch((err)=>{
    console.log("There is an error");
    console.log(err);
})