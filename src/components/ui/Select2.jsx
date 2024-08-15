import React, { useEffect } from "react";
import Select from "react-tailwindcss-select";

function buscarPorValue(data, value) {
  return data ? data.filter(item => item.value == value) : [];
}

const Select2 = ({ name, register, rules, options, label, setValue, ...props }) => {
  const [value, setValueLocal] = React.useState(null);

  const handleChange = (selectedOption) => {
    console.log(selectedOption)
    const valores = Array.isArray(selectedOption) ? selectedOption.map(item => {return item.value} ):''
    setValueLocal(selectedOption);
    setValue(
      name, 
      Array.isArray(selectedOption) 
        ? valores 
        : selectedOption 
          ? selectedOption.value 
          : ''
    );
     // Update value in useForm
  };

  useEffect(() => {
    if (props.value && props.value.includes('[') || Array.isArray(props.value)) {
      var parsedValue
      if(Array.isArray(props.value)) {
         parsedValue = props.value;
      } else {
         parsedValue = JSON.parse(props.value);
      }
      
      const dataValue = [].concat(parsedValue).map(data => buscarPorValue(options, data)[0]).filter(Boolean);

      setValueLocal(dataValue);
      setValue(name, props.value);
    } else {
      const val = buscarPorValue(options, props.value);
      if (val.length > 0) {
        setValueLocal(val[0]);
        setValue(name, val[0].value); // Update value in useForm
      }
    }
  }, [options, props.value, name, setValue]);

  return (
    <div>
      <label className="text-blue-gray-900 text-[13px]">{label}</label>{(rules && rules.required)?<b className="text-red-900">*</b>:''}
      <Select
        {...props}
        value={value}
        options={options}
        onChange={handleChange}
    
        primaryColor="amber"
        isSearchable={true}
      />
    </div>
  );
};

export default Select2;
