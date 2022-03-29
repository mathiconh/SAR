import React from "react";
import { Typography, Grid, Container } from "@material-ui/core";
import CardSocial from "./CardSocial";

const SocialMedia = () => {
  return (
    <Container>
      <Grid container direction="column" alignItems="center">
        <Grid item xs>
          <Typography variant="h3">SEGUINOS EN NUESTRAS REDES</Typography>
        </Grid>
        <Grid item xs>
          <Typography variant="subtitle1" className="">
            Aquí podras encontrar fotos de todas las fechas{" "}
          </Typography>
        </Grid>
      </Grid>

      <Grid spacing={2} container direction="row">
        <CardSocial />
      </Grid>
    </Container>
  );
};

export default SocialMedia;
