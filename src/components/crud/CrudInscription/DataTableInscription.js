import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Modal,
  Button,
  TextField,
} from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";

const Url = "http://localhost:3001/inscripciones/";

const useStyles = makeStyles((theme) => ({
  modal: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  iconos: {
    cursor: "pointer",
  },
  inputMaterial: {
    width: "100%",
  },
}));

function DataTableInscription() {
  const styles = useStyles();
  const [data, setData] = useState([]);
  const [modalInsert, setModalInsert] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [dataSelect, setDataSelect] = useState({
    title: "",
    description: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataSelect((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const peticionGet = async () => {
    await axios.get(Url).then((response) => {
      setData(response.data);
    });
  };

  const peticionPost = async () => {
    await axios.post(Url, dataSelect).then((response) => {
      setData(data.concat(response.data));
      openCloseModalInsert();
    });
  };

  const peticionPut = async () => {
    await axios
      .put(Url + dataSelect.id, dataSelect)
      .then((response) => {
        var newData = data;
        newData.forEach((data) => {
          if (dataSelect.id === data.id) {
            data.title = dataSelect.title;
            data.description = dataSelect.description;
            data.content = dataSelect.content;
          }
        });
        setData(newData);
        openCloseModalEdit();
      });
  };

  const peticionDelete = async () => {
    await axios.delete(Url + dataSelect.id).then((response) => {
      setData(data.filter((data) => data.id !== dataSelect.id));
      openCloseModalDelete();
    });
  };

  const openCloseModalInsert = () => {
    setModalInsert(!modalInsert);
  };

  const openCloseModalEdit = () => {
    setModalEdit(!modalEdit);
  };

  const openCloseModalDelete = () => {
    setModalDelete(!modalDelete);
  };

  const actionSelect = (data, action) => {
    setDataSelect(data);
    action === "Editar" ? openCloseModalEdit() : openCloseModalDelete();
  };

  useEffect(() => {
    async function fetchData() {
      // You can await here
      await peticionGet();
      // ...
    }
    fetchData();
  }, []);


  const insertBody = (
    <div className={styles.modal}>
      <h3>Agregar Nueva Inscripción</h3>
      <TextField
        name="title"
        className={styles.inputMaterial}
        label="Titulo"
        onChange={handleChange}
      />
      <br />
      <TextField
        name="description"
        className={styles.inputMaterial}
        label="Descripción"
        onChange={handleChange}
      />
      <br />
      <TextField
        name="content"
        className={styles.inputMaterial}
        label="Contenido"
        onChange={handleChange}
      />
      <br />
      <br />
      <br />
      <div align="right">
        <Button onClick={() => openCloseModalInsert()}>Cancelar</Button>
        <Button variant="contained" color="secondary" onClick={() => peticionPost()}>
          Insertar
        </Button>
      </div>
    </div>
  );

  const editBody = (
    <div className={styles.modal}>
      <h3>Editar Una Inscripción</h3>
      <TextField
        name="title"
        className={styles.inputMaterial}
        label="Titulo"
        onChange={handleChange}
        value={dataSelect && dataSelect.title}
      />
      <br />
      <TextField
        name="description"
        className={styles.inputMaterial}
        label="Descripción"
        onChange={handleChange}
        value={dataSelect && dataSelect.description}
      />
      <br />
      <TextField
        name="content"
        className={styles.inputMaterial}
        label="Contenido"
        onChange={handleChange}
        value={dataSelect && dataSelect.content}
      />
      <br />
      <br />
      <div align="right">
        <Button onClick={() => openCloseModalEdit()}>Cancelar</Button>
        <Button variant="contained" color="secondary" onClick={() => peticionPut()}>
          Editar
        </Button>
      </div>
    </div>
  );

  const deleteBody = (
    <div className={styles.modal}>
      <p>
        Estás seguro que deseas eliminar la data{" "}
        <b>{dataSelect && dataSelect.nombre}</b> ?{" "}
      </p>
      <div align="right">
        <Button variant="contained" Q color="secondary" onClick={() => peticionDelete()}>
          Sí
        </Button>
        <Button onClick={() => openCloseModalDelete()}>No</Button>
      </div>
    </div>
  );

  return (
    <div>
      <br />
      <Button variant="contained" color="secondary" onClick={() => openCloseModalInsert()}>Agregar</Button>
      <br />
      <br />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Titulo</TableCell>
              <TableCell>Descripcion</TableCell>
              <TableCell>Contenido</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((data) => (
              <TableRow key={data.id}>
                <TableCell>{data.title}</TableCell>
                <TableCell>{data.description}</TableCell>
                <TableCell>{data.content}</TableCell>
                <TableCell>
                  <Edit
                    className={styles.iconos}
                    onClick={() => actionSelect(data, "Editar")}
                  />
                  &nbsp;&nbsp;&nbsp;
                  <Delete
                    className={styles.iconos}
                    onClick={() => actionSelect(data, "Eliminar")}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={modalInsert} onClose={openCloseModalInsert}>
        {insertBody}
      </Modal>

      <Modal open={modalEdit} onClose={openCloseModalEdit}>
        {editBody}
      </Modal>

      <Modal open={modalDelete} onClose={openCloseModalDelete}>
        {deleteBody}
      </Modal>
    </div>
  );
}

export default DataTableInscription;
