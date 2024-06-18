import {z} from "zod"; 

export const matchessageSchema = z.object({
    content : z
        .string()
        .min(10,{message : "Content must be of atleast 10 characters"})
        .max(300, {message : "Content should be within 300 characters"})
})