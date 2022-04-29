import axios from "axios";

export default axios.create ({
    baseUrl: "http://localhost:5000/api/v1/SAR/inscription",
    headers: {
        "Content/type": "application/json"
    }
});