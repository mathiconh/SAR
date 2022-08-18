// import React, { useState } from "react";
// import UserDataService from "../services/users";
// import { Link } from "react-router-dom";

// const AddCar = props => {
//   const initialCarState = {
//     patente: "",
//     modelo: "",
//     año: "",
//     agregados: "",
//     historia: "",
//     tallerAsociado: ""
//   };


  
//   const [car, setCar] = useState(initialCarState);
//   const [submitted, setSubmitted] = useState(false);

//   const handleInputChange = event => {
//     setCar(event.target.value);
//   };
  

//   const saveCar = () => {
//     var data = {
//       patente: props.car.patente,
//       modelo: props.car.modelo,
//       año: props.car.año,
//       agregados: props.car.agregados,
//       historia: props.car.historia,
//       tallerAsociado: props.car.tallerAsociado,

//     };

// //    if (editing) {
// //      data.car_id = props.location.state.currentCar._id
// //      UserDataService.updateCar(data)
// //        .then(response => {
// //          setSubmitted(true);
// //          console.log(response.data);
// //        })
// //        .catch(e => {
// //          console.log(e);
// //        });
// //    } else {
// //        UserDataService.createCar(data)
// //        .then(response => {
// //          setSubmitted(true);
// //          console.log(response.data);
// //        })
// //        .catch(e => {
// //          console.log(e);
// //        });
// //    }

//   };

//   return (
//     <div>
//       <div className="submit-form">
//           <div>
//             <h4>You submitted successfully!</h4>
//             <Link to={"/cars"} className="btn btn-success">
//               Back to Cars
//             </Link>
//           </div>
//           <div>
//             <div className="form-group">
//               <label htmlFor="description">Create Car</label>
              
//               <input
//                 type="text"
//                 className="form-control"
//                 id="text"
//                 required
//                 value={patente}
//                 onChange={handleInputChange}
//                 name="text"
//               />
//               <input
//                 type="text"
//                 className="form-control"
//                 id="text"
//                 required
//                 value={año}
//                 onChange={handleInputChange}
//                 name="text"
//               />
//               <input
//                 type="text"
//                 className="form-control"
//                 id="text"
//                 required
//                 value={modelo}
//                 onChange={handleInputChange}
//                 name="text"
//               />
//               <input
//                 type="text"
//                 className="form-control"
//                 id="text"
//                 required
//                 value={tallerAsociado}
//                 onChange={handleInputChange}
//                 name="text"
//               />
//             </div>
//             <button onClick={saveCar} className="btn btn-success">
//               Submit
//             </button>
//           </div>
//       </div>

//     </div>
//   );
// };

// export default AddCar;