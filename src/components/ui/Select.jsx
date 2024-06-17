import React from 'react';

const Select = ({ name, register,rules,options, ...props }) => {
  return (
    <select {...register? register(name,rules):""} {...props} className="
    block 
    w-full 
    rounded-md 
    border-0 
    py-1.5 
    shadow-sm 
    ring-0 
    ring-inset 
    ring-gray-300 
    placeholder:text-gray-400 
    focus:ring-1 
    p-2 
    focus:ring-inset 
    focus:ring-orange-600
    sm:text-sm 
    sm:leading-6 
    outline-none
    dark:ring-gray-700">
        <option value=""  hidden>Seleccione de la lista</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
