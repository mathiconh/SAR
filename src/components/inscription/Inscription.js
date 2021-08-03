import React from "react";
import { Typography, Grid, Container } from "@material-ui/core";
import CardsInscription from "./CardsInscription";

export const Inscription = () => {
  return (
    <Container>
      <Grid container direction="column" alignItems="center">
        <Grid item xs>
          <Typography  variant="h3">Inscribite</Typography>
        </Grid>
        <Grid item xs>
          <Typography  variant="subtitle1" className="">
            Elegí en que fecha te gustaría inscribirte.
          </Typography>
        </Grid>
      </Grid>

      <Grid spacing={2} container direction="row" >
          <CardsInscription />
      </Grid>
    </Container>
  );
};
