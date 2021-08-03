import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import axios from "axios";

export default function PrizeAccordion() {
  const Url = "http://localhost:3001/premios/";

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

  return data.map((data) => {
    const { id, title, content } = data;
    return (
      <Grid item key={id}  xs={6} md={4} lg={3}>
        <Accordion elevation={2}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography> {title} </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {content}
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
    );
  });
}
