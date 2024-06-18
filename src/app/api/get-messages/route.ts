import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth"; 
import mongoose from "mongoose";

export async function GET(request: Request) {
    
    await dbConnect();

    const session = await getServerSession(authOptions); 
    const user : User = session?.user;
    
    if(!session || !session.user) {
        return Response.json
        (   
            {
                success : false , 
                message : "Not Authencated"
            }, 
            {status : 401}
        )
    }

    const userId = new mongoose.Types.ObjectId(user._id); // now if the user._id is a string (see auth/options.ts) it will be converted in mongoose object id 

    try {
        const user = await UserModel.aggregate([
            { $match: {id: userId}},
            { $unwind : '$messages'}, // unwinding arrays as messgaes are arrays, 
            { $sort : {'messages.createdAt' : -1}},
            { $group: {_id: '$_id' , messages : {$push : '$messages'}}},
        ])

        if(!user || user.length === 0) {
            return Response.json
            (   
                {
                    success : false , 
                    message : "User Not Found"
                }, 
                {status : 404}
            )
        }
        

        return Response.json
        (   
            {
                success : true , 
                messages : user[0].messages
            }, 
            {status : 200}
        )

    } catch (error) {

        console.log("An unexpected error occured : ",error); 

        return Response.json
        (   
            {
                success : false , 
                message : "An unexpected error occured : "
            }, 
            {status : 500}
        )
    }



}