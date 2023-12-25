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

export const GetProductDataByID = async (id) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/product/get-product-by-id/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const DeleteProduct = async (id) => {
    try {
        const response = await axios.delete(`http://localhost:5000/api/product/delete-product/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const EditProductById = async (payload , id) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/product/update-product/${id}`,payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}