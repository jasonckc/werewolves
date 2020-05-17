import React from 'react';
import { Grid, Role } from '../../atoms';

const Roles = ({ players, self }) => {  
  return (
    <div>
      <Grid container justifyContent="center">
        { players && players.map((player) => (
          <Grid item>
            <Role player={player} self={self}/>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Roles;