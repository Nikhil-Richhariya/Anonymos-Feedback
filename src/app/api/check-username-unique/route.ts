import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod"; 
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username : usernameValidation
})

// if some one sends a username we can tell if it exists or not

export async function GET(request : Request) {

    // we dont need to handle this on routes due to new version of nextjs sends nothing in request.method if its not get (in context to this route)
    // if(request.method !== "GET") {
    //     return Response.json({
    //         success : false, 
    //         message : "Only GET method is allowed on this route"
    //     }, 
    //     {
    //         status : 405
    //     })
    // }


    await dbConnect(); 
    // localhost:3000/api/cuu?username=nikhil , we are trying to extract username for quering

    try {
        
        const {searchParams} = new URL(request.url); 

        // queryParam is an object as mentioned in zod document
        const queryParam = {
            username : searchParams.get('username')
        }

        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam); 
        console.log(result)

        if(!result.success) {
            const usernameErrors = result.error.format().username?._errors || []

            return Response.json({
                success : false, 
                message : usernameErrors?.length >0 ? usernameErrors.join(', ') : "Invalid query Parameters"
            }, 
            {
                status : 400
            })
        }
        
        const {username} = result.data ; 

        const existingVerifiedUser = await UserModel.findOne({username, isVerified : true}); 

        if(existingVerifiedUser) {
            return Response.json({
                success : false, 
                message : "Username is already Taken"
            }, 
            {
                status : 400
            })
        }

        else {
            return Response.json({
                success : true, 
                message : "Username is available"
            }, 
            {
                status : 400
            })
        }

    } catch (error) {
        console.error("Error Checking username" , error); 
        return Response.json
        (   
            {
                success : false , 
                message : "Error checking username"
            }, 
            {status : 500}
        )
    }

}
