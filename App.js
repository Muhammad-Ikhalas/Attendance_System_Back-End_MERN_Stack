const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bodyParser = require('body-parser');
const routes = require('./Routes/routes')

const app = express()
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(routes)


const MONGO_URI = 'copy the url from the mongoose';
mongoose.connect(MONGO_URI).then(() =>{
    app.listen(8000, ()=>{
        console.log("Server is listening to requests on port 8000...")
    })
   
}).catch(err =>{
    console.log(err)
})
