import React from "react";
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  CardActions,
  CardMedia,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const useStyles = makeStyles({
  media: {
    height: 140,
  },
});

export default function CardsInscription() {
  const Url = "http://localhost:3001/inscripciones/";

  const [data, setData] = useState([]);


  const peticionGet = async () => {
    await axios.get(Url).then((response) => {
      setData(response.data);
    });
  };

  useEffect(() => {
    async function fetchData() {
      // You can await here
      await peticionGet();
      // ...
    }
    fetchData();
  }, []);


  const classes = useStyles();

  return data.map((data) => {
    const { id, title, img, description, content } = data;

    return (
      <Grid key={id} item xs={12} sm={6} lg={4}>
        <Card elevation={3}>
          <CardMedia
            className={classes.media}
            image={img}
            title={title}
          />
          <CardHeader title={title} subheader={description} />
          <CardContent>
            <Typography variant="body2">{content}</Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              Inscribite
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  });
}
