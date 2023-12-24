import axios from "axios"

export const CreateProduct = async (payload) => {
    try {
        const response = await axios.post("http://localhost:5000/api/product/create-product", payload);
        
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetProductsData = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/product/get-all-products");
        return response.data;

    } catch (error) {
        return error.message
    }
}