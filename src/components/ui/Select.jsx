import React from 'react';

const Select2 = ({ name, register, rules, options, label, ...props }) => {
  const [value, setValue] = React.useState("");
  const handleChange = (event) => {
    
    setValue(event.target.value);
  };

  return (
    <div className="relative w-full h-14">
      <select
        {...(register ? register(name, rules) : {})}
        {...props}
        value={value}
        onChange={handleChange}
        className={`peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline-none focus:outline-none disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 t  text-sm px-2 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-yellow-500`}
      >
        <option value="" hidden></option>
        {options.map(option => (
          <option key={option.value} value={option.value} selected={option.selected?true:false}>
            {option.label}
          </option>
        ))}
      </select>
      <label
        className={`absolute left-2 top-4 text-blue-gray-700 transition-all duration-200 ease-in-out transform origin-top-left pointer-events-none peer-placeholder-shown:-translate-y-0.5 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 ${value ? '-translate-y-3 scale-75' : ''}`}
      >
        {label}
      </label>
    </div>
  );
};

export default Select2;
