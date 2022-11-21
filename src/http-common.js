import axios from "axios";

// export default axios.create ({
//     baseUrl: "http://localhost:5000/api/v1/SAR/user",
//     headers: {
//         "Content-type": "application/json"
//     }
// });

export default axios.create({
    baseURL: "https://data.mongodb-api.com/app/sarapi-zfogf/endpoint/",
    headers: {
      "Content-type": "application/json"
    }
  });