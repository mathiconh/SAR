import {
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardActionArea,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";


const useStyles = makeStyles({
  media: {
    height: 300,
  },
});

const CardsCrud = (props) => {
  const { history } = props;



  const handleButtonClick = (path) => {
    history.push(path);
  };

  const data = [
    {
      id: 1,
      title: "Inscripción",
      img: "https://via.placeholder.com/330x220",
      path:"/AddInscripción",
    },
    {
      id: 2,
      title: "Crónograma",
      img: "https://via.placeholder.com/330x220",
      path:"/AddCrónograma",
    },
    {
      id: 3,
      title: "Campeones",
      img: "https://via.placeholder.com/330x220",
      path:"/AddCampeones",
    },
    {
      id: 4,
      title: "Premios",
      img: "https://via.placeholder.com/330x220",
      path:"/AddPremios",
    },
  ];

  

 


  const classes = useStyles();


  return data.map((data) => {
    const { id, title, img, path, description,  } = data;



    return (
      <Grid key={id} item xs={12} sm={6} lg={4}>
        <Card elevation={3}>
          <CardActionArea
          onClick={() => handleButtonClick(path)}>
            <CardMedia className={classes.media} image={img} title={title} />
            <CardHeader align="center" title={title} subheader={description} />
          </CardActionArea>
        </Card>
      </Grid>
    );
  });
};


export default withRouter(CardsCrud);

