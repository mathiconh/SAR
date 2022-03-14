import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import { ScheduleFriday } from "./days/ScheduleFriday";
import { ScheduleSunday } from "./days/ScheduleSunday";
import { ScheduleSaturday } from "./days/ScheduleSaturday";
import { Container, Grid } from "@material-ui/core";
import { Prize } from "../prize/Prize";
import {Champions} from '../champions/Champions'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Container>
          <Box>{children}</Box>
        </Container>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export function Schedule() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Container className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Viernes 21/05/2021" {...a11yProps(0)} />
            <Tab label="Sabado 22/05/2021" {...a11yProps(1)} />
            <Tab label="Domingo 23/05/2021" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <Grid container direction="row">
            <ScheduleFriday />
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Grid container direction="row">
            <ScheduleSaturday />
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Grid container direction="row">
            <ScheduleSunday />
          </Grid>
        </TabPanel>
      </Container>

      <Prize />

      <Champions />
    </>
  );
}
