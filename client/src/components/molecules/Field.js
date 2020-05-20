import React from 'react';
import { Input } from '../atoms/Input/Input';
import { Typography } from '../atoms';

 export const Field = ({ name, label, placeholder, onChange, value }) => {
  return (
    <div>
      <Typography variant="label"> {label} </Typography>
      <Input 
        type="text" 
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange} />
    </div>
  );
};

