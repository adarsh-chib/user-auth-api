import express, { Router } from "express";
import mongoose from "mongoose";
import "dotenv/config";
import { connectDB } from "./config/db";
import { requestLoggger } from "./middleware/global.middleware";
import router from "./routes/user.routes";


 
const app = express();
const PORT = process.env.PORT || 2000;

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use(requestLoggger);
app.use('/api',router);

const server = async() =>{
    await connectDB();

    app.listen(PORT, ()=>{
    console.log(`server has been running on ${PORT}`);
})

}

server();

