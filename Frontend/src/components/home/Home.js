import React from "react";
import "../../index.css";
import { Typography, Grid, Button } from "@material-ui/core";
import SocialMedia from '../socialMedia/SocialMedia';
import { motion } from "framer-motion"


const prueba = {
  hidden:{
    x: "100vh",
  },
  show:{
    x:0,
    transition:{
      duration: 1,
      ease: "easeIn",
    },
  },
};


export const Home = () => {
  return (
    <>
      <Grid
        container
        className="img"
        alignItems="center"
        justify="center"
        direction="column"
      >
        <Grid item>
          <motion.h1 variants={prueba} initial="hidden" animate="show" variant="h3" align="center" className="p">
            Veni a probar los tiempos de tu auto
          </motion.h1>

          <Typography variant="subtitle1" align="center" className="p">
            EN EL GRAN AUTODROMO DE BUENOS AIRES
          </Typography>
        </Grid>

        <Grid item>
          <Button variant="contained" color="primary" className="margin">
            Inscribite
          </Button>

          <Button variant="contained" color="primary" className="margin">
            Iniciar sesión
          </Button>
        </Grid>
      </Grid>

      <SocialMedia />
    </>
  );
};

/** 
  <Grid container alignContent="center" className="img">
    <Grid item container xs={12} justify="center">
      <Typography variant="h3" align="center" className="p">
        Veni a probar los tiempos de tu auto
      </Typography>
    </Grid>

    <Grid item container xs={12} justify="center">
      <Typography variant="subtitle1" align="center" className="p">
        EN EL GRAN AUTODROMO DE BUENOS AIRES
      </Typography>
    </Grid>

    <Grid container spacing={2}>
      <Grid item container justify="flex-end" xs>
        <Button variant="contained" color="primary">
          Inscribite
        </Button>
      </Grid>

      <Grid item container justify="flex-start" xs>
        <Button variant="contained" color="primary">Iniciar sesión</Button>
      </Grid>
    </Grid>
  </Grid>
**/
