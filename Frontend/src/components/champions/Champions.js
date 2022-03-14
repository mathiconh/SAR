import React from "react";
import { Typography, Grid, Container, Button } from "@material-ui/core";
import CardsChampions from "./CardsChampions";
import "../../index.css";

export const Champions = () => {
  return (
    <Container>
      <Grid container direction="column" alignItems="center">
        <Grid item xs>
          <Typography variant="h3">Campeones</Typography>
        </Grid>
        <Grid item xs>
          <Typography variant="subtitle1" className="">
            Ganadores de la ultima fecha.
          </Typography>
        </Grid>
      </Grid>

      <Grid spacing={2} container direction="row">
        <CardsChampions />
      </Grid>

      <Grid container justify="center">
        <Button variant="contained" color="primary" className="margin">
          VER MIS TIEMPOS
        </Button>
      </Grid>
    </Container>
  );
};
