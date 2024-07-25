import React from "react";
import { useForm } from "react-hook-form";

const Textarea = ({ name, register, rules, label, ...props }) => {
  const type = props.type || "text";

  return (
    <>
      <div class="">
        {label && (
          <label className={`text-blue-gray-800 text-[13px]`}>{label}</label>
        )}
        {(rules && rules.required)?<b className="text-red-900">*</b>:''}

        <textarea
          {...(register && register(name, rules))}
          class="peer w-full  bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border  border  text-sm px-3 py-2.5 rounded-[7px] border-gray-300 focus:border-yellow-500"
          {...props}
          placeholder=" "
          cols={5}
        />
      </div>
    </>
  );
};

export default Textarea;
