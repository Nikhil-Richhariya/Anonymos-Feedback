import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Description } from "@radix-ui/react-toast";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const VerifyAccount = () => {
  const router = useRouter();

  const params = useParams<{ username: string }>();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });


  const onSubmit = async (data : z.infer<typeof verifySchema) => {
    try {
        const reponse = await axios.post(/`api/verify-code`, {
            username : Params.username,
            code : data.code
        }); 

        toast({
            title : "Success", 
            Description : response.data.message
        })
    } catch (error) {
        
    }
  }

  return <div></div>;
};

export default VerifyAccount;
