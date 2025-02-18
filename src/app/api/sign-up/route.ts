
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"; 
import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";

export async function POST(request: Request) {
    await dbConnect();

    try { 
        const { username, email, password } = await request.json(); 

        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });
        if (existingUserVerifiedByUsername) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Username is already taken"
                }), 
                { status: 400 }
            );
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); 

        if (existingUserVerifiedByEmail) {
            if (existingUserVerifiedByEmail.isVerified) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        message: "User already exists with this email"
                    }), 
                    { status: 400 }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifyCode = verifyCode;
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

                try {
                    console.log("Updating existing user:", existingUserVerifiedByEmail);
                    await existingUserVerifiedByEmail.save();
                } catch (error) {
                    console.error("Error updating existing user:", error);
                    return new Response(
                        JSON.stringify({
                            success: false,
                            message: "Error updating existing user"
                        }), 
                        { status: 500 }
                    );
                }
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date(Date.now() + 3600000);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            });

            try {
                console.log("Saving new user:", newUser);
                await newUser.save();
            } catch (error) {
                console.error("Error saving new user:", error);
                return new Response(
                    JSON.stringify({
                        success: false,
                        message: "Error saving new user"
                    }), 
                    { status: 500 }
                );
            }
        }

        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: emailResponse.message
                }), 
                { status: 500 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "User registered successfully, Please verify your email"
            }), 
            { status: 200 }
        );

    } catch (error) {
        console.error("Error registering user:", error); 

        return new Response(
            JSON.stringify({
                success: false,
                message: "Error registering user"
            }), 
            { status: 500 }
        );
    }
}







// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import bcrypt from "bcryptjs"; 
// import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";

// export async function POST(request: Request) {
    
//     await dbConnect()

//     try { 

//         const {username, email, password} = await request.json(); 

//         const existingUserVerifiedByUsername = await UserModel.findOne({
//             username, 
//             isVerified : true
//         })

//         if(existingUserVerifiedByUsername) {
//             return Response.json(
//                 {
//                     success: false, // as user is obtained, can't register
//                     message : "Username is already taken"
//                 }, 
//                 {
//                     status : 400
//                 }
//             )
//         }

//         const existingUserVerifiedByEmail = await UserModel.findOne({email})

//         const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); 

//         if(existingUserVerifiedByEmail) {
//             if(existingUserVerifiedByEmail.isVerified) {
//                 return Response.json(
//                     {
//                         success: false,
//                         message : "User already exists with this email"
//                     },
//                     {
//                         status : 400
//                     }
//                 )
//             }
//             else {

//                 const hashedPassword = await bcrypt.hash(password,10)
//                 existingUserVerifiedByEmail.password = hashedPassword;
//                 existingUserVerifiedByEmail.verifyCode = verifyCode ;
//                 existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

//                 await existingUserVerifiedByEmail.save() ; 
//             }
//         }else {
//             const hashedPassword = await bcrypt.hash(password,10)
//             const expiryDate = new Date()
//             expiryDate.setHours(expiryDate.getHours() + 1)

//             const newUser = new UserModel({
//                 username,
//                 email,
//                 password : hashedPassword,
//                 verifyCode, 
//                 verifyCodeExpiry : expiryDate, 
//                 isVerified : false,
//                 isAcceptingMessage : true, 
//                 messages: []
//             })
            
//             console.log("User saved !")
//             await newUser.save()
//         }

//         // send verification email
//         const emailResponse = await sendVerificationEmail(
//             email, 
//             username, 
//             verifyCode
//         )

//         if(!emailResponse.success) {
//             return Response.json(
//                 {
//                     success: false, // as user is obtained, can't register
//                     message : emailResponse.message
//                 }, 
//                 {
//                     status : 500
//                 }
//             )
//         }
        
//         return Response.json(
//             {
//                 success: true, // as user is obtained, can't register
//                 message : "User registered successfully, Please verify your email"
//             }, 
//             {
//                 status : 200
//             }
//         )
        


//     } catch(error) {
//         console.error("Error registering user", error); 

//         //sent to front end
//         return Response.json(
//             {
//                 success: false,
//                 message: "Error registering user"
//             }, 
//             {
//                 status : 500
//             }
//         );
//     }
// }