import React, { useEffect } from "react";
import Select from "react-tailwindcss-select";

function buscarPorValue(data, value) {
  return data.filter(item => item.value === value);
}

const Select2 = ({
  name,
  register,
  rules,
  options,
  label,
  setValue,
  ...props
}) => {
  const [value, setValueLocal] = React.useState();

  const handleChange = (selectedOption) => {
    setValueLocal(selectedOption);
    setValue(name, selectedOption.value); // Actualiza el valor en useForm
  };

  useEffect(() => {
    const val = buscarPorValue(options, props.value);
    if (val.length > 0) {
      setValueLocal(val[0]);
      setValue(name, val[0].value); // Actualiza el valor en useForm
    }
  }, [options, name, setValue]);

  return (
    <div className="">
      <label className={`text-blue-gray-800 text-[13px]`}>{label}</label>
      <Select
        {...(register ? register(name, rules) : {})}
        {...props}
        value={value}
        options={options}
        onChange={handleChange}
        classNames={"text-black"}
        primaryColor="amber"
        isSearchable={true}
      />
    </div>
  );
};

export default Select2;
