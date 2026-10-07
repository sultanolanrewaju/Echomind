import express, { Request, Response } from "express";
import cors from "cors"
import "dotenv/config"


const app = express()

app.use(cors())

app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({message:"Julian Everything is working fine."})
})


app.listen(3000,()=>{
    console.log("Server is Up and Running by programmer <Sultan/>");
    
})