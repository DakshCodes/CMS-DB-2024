import axios from "axios"

export const loginUser = async(payload)=>{
    try {
        const response = await axios.post("http://localhost:5000/api/login",payload);
        return response.data;

    } catch (error) {
        return error.message 
    }
}


export const GetCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        // Handle the case where the token is not available
        throw new Error("Token not available");
      }
  
      const response = await axios.get("http://localhost:5000/api/get-current-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error) {
      return error.message;
    }
  };