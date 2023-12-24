import axios from "axios"

export const CreateProduct = async (payload) => {
    try {
      const response = await axios.post("http://localhost:5000/api/product/create-product", payload);
      return response.data;
  
    } catch (error) {
      return error.message
    }
  }