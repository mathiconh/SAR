import React from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardActionArea,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import  '../../index.css'
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";


const useStyles = makeStyles({
  media: {
    height: 300,
  },
});

export default function CardsChampions() {
  const Url = "http://localhost:3001/campeones/";

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
    const { id, title, img, content } = data;

    return (
      <Grid key={id} item xs={12} sm={6} lg={4}>
        <Card elevation={3} >
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={img}
            title={title}
          />
          <CardHeader align="center" title={title} subheader={content} />
          </CardActionArea>
        </Card>
      </Grid>
    );
  });
}

