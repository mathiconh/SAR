import React from 'react'
import { Typography, Grid, Container } from "@material-ui/core";
import CardsCrud from './CardsCrud';

const Crud = () => {
  return (
    <Container>
      <Grid container direction="column" alignItems="center">
        <Grid item xs>
          <Typography  variant="h3">CRUD</Typography>
        </Grid>
        <Grid item xs>
          <Typography  variant="subtitle1" className="">
            Acá podrás administrar todo el contenido de la página
          </Typography>
        </Grid>
      </Grid>

      <Grid spacing={2} container direction="row" >
        <CardsCrud />
      </Grid>
    </Container>
  )
}

export default Crud;
