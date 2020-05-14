import React from 'react';
import styled from 'styled-components';
import { Input } from '../atoms/Input/Input';
import { Title } from '../atoms/Typography/Typography';

 export const Field = ({ label, placeholder }) => {
  return (
    <div>
      <Title> { label }</Title>
      <Input type="text" placeholder={placeholder}/>
    </div>
  );
};

