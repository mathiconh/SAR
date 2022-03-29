import "./App.css";
import NavBar from "./components/header/NavBar";
import { Home } from "./components/home/Home";
import { Schedule } from "./components/schedule/Schedule";
import { Route, Switch } from "react-router-dom";
import Crud from "./components/crud/Crud";
import DataTableInscription from "./components/crud/CrudInscription/DataTableInscription";
import { Inscription } from "./components/inscription/Inscription";
import DataTablePrize from "./components/crud/CrudPrize/DataTablePrize";
import DataTableChampions from "./components/crud/CrudChampions/DataTableChampions";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Switch>
        <Route exact from="/" render={(props) => <Home {...props} />} />
        <Route
          exact
          from="/Inscripción"
          render={(props) => <Inscription {...props} />}
        />
        <Route
          exact
          from="/Crónograma"
          render={(props) => <Schedule {...props} />}
        />
        <Route exact from="/Crud" render={(props) => <Crud {...props} />} />

        <Route
          exact
          from="/AddInscripción"
          render={(props) => <DataTableInscription {...props} />}
        />

        <Route
          exact
          from="/AddPremios"
          render={(props) => <DataTablePrize {...props} />}
        />

        <Route
          exact
          from="/AddCampeones"
          render={(props) => <DataTableChampions {...props} />}
        />
      </Switch>
    </div>
  );
}

export default App;
