import {
  makeStyles,
  Typography,
  Grid,
  List,
  ListItem,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

export const ScheduleFriday = () => {
  const classes = useStyles();

  const data = [
    {
      id: "1",
      heading: "Clase 1",
      secondaryHeading: "de 10:00  a 11:00",
    },
    {
      id: "2",
      heading: "Clase 2",
      secondaryHeading: "de 10:00  a 11:00",
    },
    {
      id: "3",
      heading: "Clase 3",
      secondaryHeading: "de 10:00  a 11:00",
    },
    {
      id: "4",
      heading: "Clase 4",
      secondaryHeading: "de 10:00  a 11:00",
    },
    {
      id: "5",
      heading: "Clase 5",
      secondaryHeading: "de 10:00  a 11:00",
    },
    {
      id: "6",
      heading: "Clase 6",
      secondaryHeading: "de 10:00  a 11:00",
    },
    {
      id: "7",
      heading: "Clase 7",
      secondaryHeading: "de 10:00  a 11:00",
    },
    {
      id: "8",
      heading: "Clase 8",
      secondaryHeading: "de 10:00  a 11:00",
    },
    {
      id: "9",
      heading: "Clase 9",
      secondaryHeading: "de 10:00  a 11:00",
    },
    {
      id: "10",
      heading: "Clase 10",
      secondaryHeading: "de 10:00  a 11:00",
    },
  ];

  return data.map((data) => {

    const { id, heading, secondaryHeading } = data;
    
    return (
      <Grid key={id} xs={12} sm={6} lg={4} item>
        <List className={classes.root}>
          <ListItem divider>
            <Typography variant="subtitle1" className={classes.heading}>{heading}</Typography>
            <Typography variant="subtitle1" className={classes.secondaryHeading}>
              {secondaryHeading}
            </Typography>
          </ListItem>
        </List>
      </Grid>
    );
  });
};
