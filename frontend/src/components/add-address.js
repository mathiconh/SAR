import React, { useState } from "react";
import UserDataService from "../services/users";
import { Link } from "react-router-dom";

const AddAddress = props => {
  let initialAddressState = ""

  let editing = false;

  if (props.location.state && props.location.state.currentAddress) {
    editing = true;
    initialAddressState = props.location.state.currentAddress.text
  }

  const [address, setAddress] = useState(initialAddressState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = event => {
    setAddress(event.target.value);
  };

  const saveAddress = () => {
    var data = {
      text: address,
      name: props.user.name,
      user_id: props.user.id,
      user_id: props.match.params.id
    };

    if (editing) {
      data.address_id = props.location.state.currentAddress._id
      UserDataService.updateAddress(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      UserDataService.createAddress(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }

  };

  return (
    <div>
      {props.user ? (
      <div className="submit-form">
        {submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <Link to={"/users/" + props.match.params.id} className="btn btn-success">
              Back to User
            </Link>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="description">{ editing ? "Edit" : "Create" } Address</label>
              <input
                type="text"
                className="form-control"
                id="text"
                required
                value={address}
                onChange={handleInputChange}
                name="text"
              />
            </div>
            <button onClick={saveAddress} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>

      ) : (
      <div>
        Please log in.
      </div>
      )}

    </div>
  );
};

export default AddAddress;