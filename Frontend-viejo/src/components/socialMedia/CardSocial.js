import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardActionArea,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  media: {
    height: 350,
  },
});

export default function CardSocial() {
  const data = [
    {
      id: 1,
      img: "https://via.placeholder.com/330x220",
    },
    {
      id: 2,
      img: "https://via.placeholder.com/330x220",
    },
    {
      id: 3,
      img: "https://via.placeholder.com/330x220",
    },
    {
      id: 4,
      img: "https://via.placeholder.com/330x220",
    },
  ];

  const classes = useStyles();

  return data.map((data) => {
    const { id, img } = data;

    return (
      <Grid key={id} item xs={12} sm={6} lg={4}>
        <Card elevation={3}>
          <CardActionArea>
            <CardMedia className={classes.media} image={img} />
          </CardActionArea>
        </Card>
      </Grid>
    );
  });
}
