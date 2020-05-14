import React from 'react';
import styled from 'styled-components';
import { Input } from '../atoms/Input/Input';
import { Typography } from '../atoms';

 export const Field = ({ label, placeholder }) => {
  return (
    <div>
      <Typography variant="label"> {label} </Typography>
      <Input type="text" placeholder={placeholder}/>
    </div>
  );
};

