import React, { useState, useEffect, Component } from "react";
import CarsDataService from "../services/cars";
import { Link } from "react-router-dom";


const CarsList = props => {
    const [cars, setCars] = useState([]);
    const [totalPages, setTotalPages] = useState([]);
    const [totalResults, setTotalResults] = useState([]);
    const [searchPatent, setSearchPatent ] = useState("");
    const [searchId, setSearchId ] = useState("");
    // const [searchIdRol, setSearchIdRol ] = useState("");
    // const [idRols, setIdRoles] = useState(["All IdRoles"]);
  
    useEffect(() => {
      retrieveCars();
    //   retrieveIdRol();
    }, []);
  
    const onChangeSearchId = e => {
      const searchId = e.target.value;
      setSearchId(searchId);
    };
  
    const onChangeSearchPatent = e => {
      const searchPatent = e.target.value;
      setSearchPatent(searchPatent);
    };
  
    // const onChangeSearchIdRol = e => {
    //   const searchIdRol = e.target.value;
    //   setSearchIdRol(searchIdRol);
      
    // };
  
    const retrieveCars = () => {
      CarsDataService.getAll()
        .then(response => {
          console.log('Data: ', response.data);
          setCars(response.data.cars);
          setTotalPages(response.data.total_pages);
          setTotalResults(response.data.total_results);
        })
        .catch(e => {
          console.log(e);
        });
    };

    const deleteCar = (carId) => {
        
        CarsDataService.deleteCar(carId)
          .then(response => {
            setCars(response.data.cars);
            
        console.log("entra");
          })
          .catch(e => {
            console.log(e);
          });
      };
  
    // const retrieveIdRol = () => {
    //   CarsDataService.getIdRol()
    //     .then(response => {
    //       console.log('Resultados: ', response.data);
    //       setIdRoles(["All IdRoles"].concat(response.data));
          
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
    // };
  
    const refreshList = () => {
      retrieveCars();
    };
  
    const find = (query, by) => {
      CarsDataService.find(query, by)
        .then(response => {
          console.log('Data: ', response.data);
          setCars(response.data.cars);
          setTotalPages(response.data.total_pages);
          setTotalResults(response.data.total_results);
        })
        .catch(e => {
          console.log(e);
        });
    };
  
    const findByPatent = () => {
      find(searchPatent, "Patente")
    };
  
    const findById = () => {
      find(searchId, "_id")
    };

  
    // const findByIdRol = () => {
    //   if (searchIdRol === "All IdRoles") {
    //     refreshList();
    //   } else {
    //     find(searchIdRol, "IdRol")
    //   }
    // };
    function getPages() {
        let pages = [];
        for (let index = 0; index < totalPages; index++) {
            pages.push(index+1);
        }
        return pages;
    };

    let items = getPages();

    let itemList = items.map((item,index)=>{
        console.log('Index: ', index+1);
        return <li className="page-item active"><a href="#" className="page-link">{index+1}</a></li>
    })

return (
<div>
    <div className="container-xl">
        <div className="table-responsive">
            <div className="table-wrapper">
                <div className="table-title">
                    <div className="row">
                        <div className="col-sm-6">
                            <h2>Administrar <b>Autos</b></h2>
                        </div>
                        <div className="col-sm-6">
                            <a href="#addCarModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>Add New Car</span></a>
                            <a href="#deleteCarModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>Delete</span></a>						
                        </div>
                    </div>
                </div>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>
                                <span className="custom-checkbox">
                                    <input type="checkbox" id="selectAll"></input>
                                    <label htmlFor="selectAll"></label>
                                </span>
                            </th>
                            <th>Id</th>
                            <th>Patente</th>
                            <th>Modelo</th>
                            <th>Año</th>
                            <th>Workshop Asociado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars.map((car) => {
                            const id = `${car._id}`;
                            const patent = `${car.patent}`;
                            const model = `${car.model}`;
                            const year = `${car.year}`;
                            const workshopAssociated = `${car.workshopAssociated}`;
                            return (
                                <tr>
                                    <td>
                                        <span className="custom-checkbox">
                                            <input type="checkbox" id="checkbox2" name="options[]" value="1"></input>
                                            <label htmlFor="checkbox2"></label>
                                        </span>
                                    </td>
                                    <td>{id}</td>
                                    <td>{patent}</td>
                                    <td>{model}</td>
                                    <td>{year}</td>
                                    <td>{workshopAssociated}</td>
                                    <td>
                                        <a href="#editCarModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                        <a href="#carsDelete" className="delete" data-toggle="modal" onClick={() => deleteCar(car._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                    </td>
                                </tr>
                                );
                            })}
                    </tbody>
                </table>
                <div className="clearfix">
                    <div className="hint-text">Showing <b>{`${totalResults}`}</b> out of <b>{`${totalPages}`}</b> entries</div>
                    <ul className="pagination">
                        <li className="page-item"><a href="#" className="page-link">Previous</a></li>
                        {itemList}
                        <li className="page-item"><a href="#" className="page-link">Next</a></li>
                    </ul>
                </div>
            </div>
        </div>        
    </div>
    {/* Edit Modal HTML */}
    <div id="addCarModal" className="modal fade">
        <div className="modal-dialog">
            <div className="modal-content">
                <form>
                    <div className="modal-header">						
                        <h4 className="modal-title">Add Car</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div className="modal-body">					
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" className="form-control" required></input>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" className="form-control" required></input>
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <textarea className="form-control" required></textarea>
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input type="text" className="form-control" required></input>
                        </div>					
                    </div>
                    <div className="modal-footer">
                        <input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel"></input>
                        <input type="submit" className="btn btn-success" value="Add"></input>
                    </div>
                </form>
            </div>
        </div>
    </div>
    {/* Edit Modal HTML */}
    <div id="editCarModal" className="modal fade">
        <div className="modal-dialog">
            <div className="modal-content">
                <form>
                    <div className="modal-header">						
                        <h4 className="modal-title">Edit Car</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div className="modal-body">					
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" className="form-control" required></input>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" className="form-control" required></input>
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <textarea className="form-control" required></textarea>
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input type="text" className="form-control" required></input>
                        </div>					
                    </div>
                    <div className="modal-footer">
                        <input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel"></input>
                        <input type="submit" className="btn btn-info" value="Save"></input>
                    </div>
                </form>
            </div>
        </div>
    </div>
    {/* Delete Modal HTML */}
    <div id="deleteCarModal" className="modal fade">
        <div className="modal-dialog">
            <div className="modal-content">
                <form>
                    <div className="modal-header">						
                        <h4 className="modal-title">Delete Car</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div className="modal-body">					
                        <p>Are you sure you want to delete these Records?</p>
                        <p className="text-warning"><small>This action cannot be undone.</small></p>
                    </div>
                    <div className="modal-footer">
                        <input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel"></input>
                        <input type="submit" className="btn btn-danger" value="Delete"></input>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
);
}

export default CarsList;