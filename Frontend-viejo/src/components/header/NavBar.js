import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    [theme.breakpoints.down("xs")]: {
      flexGrow: 1,
    },
  },
  headerOptions: {
    display: "flex",
    flex: 1,
    justifyContent: "space-evenly",
  },
}));

const NavBar = (props) => {
  const { historia } = props;
  const classes = useStyles();
  const [openCloseElement, setOpenCloseElement] = React.useState(null);
  const open = Boolean(openCloseElement);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const handleMenu = (event) => {
    setOpenCloseElement(event.currentTarget);
  };

  const handleMenuClick = (pageURL) => {
    historia.push(pageURL);
    setOpenCloseElement(null);
  };

  const handleButtonClick = (pageURL) => {
    historia.push(pageURL);
  };

  const menuItems = [
    {
      id: "1",
      menuTitle: "Home",
      pageURL: "/",
    },
    {
      id: "2",
      menuTitle: "Inscripción",
      pageURL: "/Inscripción",
    },
    {
      id: "3",
      menuTitle: "Crónograma",
      pageURL: "/Crónograma",
    },
    {
      id: "4",
      menuTitle: "Iniciar Sesión",
      pageURL: "/Login",
    },
    {
      id: "5",
      menuTitle: "CRUD",
      pageURL: "/Crud",
    },
  ];

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            S4R
          </Typography>
          {isMobile ? (
            <>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={openCloseElement}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={() => setOpenCloseElement(null)}
              >
                {menuItems.map((menuItem) => {
                  const { id, menuTitle, pageURL } = menuItem;
                  return (
                    <MenuItem key={id} onClick={() => handleMenuClick(pageURL)}>
                      {menuTitle}
                    </MenuItem>
                  );
                })}
              </Menu>
            </>
          ) : (
            <div className={classes.headerOptions}>
              {menuItems.map((menuItem) => {
                const { id, menuTitle, pageURL } = menuItem;
                return (
                  <Button
                    key={id}
                    variant="contained"
                    color="secondary"
                    onClick={() => handleButtonClick(pageURL)}
                  >
                    {menuTitle}
                  </Button>
                );
              })}
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(NavBar);
