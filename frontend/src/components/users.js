import React, { useState, useEffect } from "react";
import UserDataService from "../services/users";
import { Link } from "react-router-dom";

const User = props => {
  const initialUserState = {
    id: null,
    name: "",
    address: {},
    idRol: "",
    addresses: []
  };
  const [user, setUser] = useState(initialUserState);

  const getUser = id => {
    UserDataService.get(id)
      .then(response => {
        setUser(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getUser(props.match.params.id);
  }, [props.match.params.id]);

  const deleteAddress = (addressId, index) => {
    UserDataService.deleteAddress(addressId, props.user.id)
      .then(response => {
        setUser((prevState) => {
          prevState.addresses.splice(index, 1)
          return({
            ...prevState
          })
        })
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {user ? (
        <div>
          <h5>{user.name}</h5>
          <p>
            <strong>Id Rol: </strong>{user.idRol}<br/>
            <strong>Address: </strong>{user.address}
          </p>
          <Link to={"/users/" + props.match.params.id + "/address"} className="btn btn-primary">
            Add Address
          </Link>
          <h4> Addresss </h4>
          <div className="row">
            {user.addresses.length > 0 ? (
             user.addresses.map((address, index) => {
               return (
                 <div className="col-lg-4 pb-1" key={index}>
                   <div className="card">
                     <div className="card-body">
                       <p className="card-text">
                         {address.text}<br/>
                         <strong>User: </strong>{address.name}<br/>
                         <strong>Date: </strong>{address.date}
                       </p>
                       {props.user && props.user.id === address.user_id &&
                          <div className="row">
                            <a onClick={() => deleteAddress(address._id, index)} className="btn btn-primary col-lg-5 mx-1 mb-1">Delete</a>
                            <Link to={{
                              pathname: "/users/" + props.match.params.id + "/address",
                              state: {
                                currentAddress: address
                              }
                            }} className="btn btn-primary col-lg-5 mx-1 mb-1">Edit</Link>
                          </div>                   
                       }
                     </div>
                   </div>
                 </div>
               );
             })
            ) : (
            <div className="col-sm-4">
              <p>No addresses yet.</p>
            </div>
            )}

          </div>

        </div>
      ) : (
        <div>
          <br />
          <p>No user selected.</p>
        </div>
      )}
    </div>
  );
};

export default User;