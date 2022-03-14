import React from "react";
import { Typography, Grid, Container } from "@material-ui/core";
import PrizeAccordion from "./PrizeAccordion";

export const Prize = () => {
  return (
    <Container>
      <Grid container direction="column" alignItems="center">
        <Grid item xs>
          <Typography  variant="h3">PREMIOS</Typography>
        </Grid>
        <Grid item xs>
          <Typography  variant="subtitle1" className="">
            Si salis campeón te ganas:
          </Typography>
        </Grid>
      </Grid>

      <Grid spacing={2} container direction="row" >
          <PrizeAccordion />
      </Grid>
    </Container>
  );
};
