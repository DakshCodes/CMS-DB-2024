import axios from "axios"
import toast from 'react-hot-toast'


export const loginUser = async (payload) => {
  try {
    const response = await axios.post("http://localhost:5000/api/login", payload);
    return response.data;
    const id = response.data.user._id
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




export const UploadImage = async(payload) =>{
  try {
      const response = await axios.post(`http://localhost:5000/api/product/upload`,payload);
      return response.data;
      
  } catch (error) {
      return error.message;
  }
}
export const UploadProfileImage = async(payload) =>{
  try {
      const response = await axios.post(`http://localhost:5000/api/uploadprofileimage`,payload);
      return response.data;
      
  } catch (error) {
      return error.message;
  }
}

export const updateUser = async (payload,id) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/updateuser/${id}`,
   payload);
    return response.data;
    
  } catch (error) {
    return error.message
  }
}
