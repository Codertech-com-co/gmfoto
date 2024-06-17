import React from 'react';
import { useForm } from "react-hook-form";

const Textarea = ({ name, register,rules, ...props }) => { 
    
    return (
        <textarea
            {...register? register(name,rules):""}
            className=" 
            block 
            w-full
            rounded-lg 
            border-0
            py-1.5  
            shadow-sm 
            ring-0 
            ring-inset 
            ring-gray-300 
            placeholder:text-gray-400 
            focus:ring-1 p-2 
            focus:ring-inset 
            focus:ring-orange-100
            sm:text-sm 
            sm:leading-6
            outline-none
            dark:ring-gray-700"
            {...props}
            
        ></textarea>
    );
};

export default Textarea;
