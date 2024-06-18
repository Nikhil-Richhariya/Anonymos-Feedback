import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

type ConnectionObject = { 
    isConnected ?: number // readyState is a number
}

const connection : ConnectionObject = {}

async function dbConnect() : Promise<void> {
    if(connection.isConnected) {
        console.log("Already connected to database"); 
        return ; 
    }

    try{
        const db = await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI || "", {})
        
        connection.isConnected = db.connections[0].readyState

        console.log("DB Connected Succesfully"); 
    
    } catch(error) {


        console.log("Database connection failed" , error)
        process.exit(1)
    }

}


export default dbConnect; 