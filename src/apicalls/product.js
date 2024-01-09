import axios from "axios"

export const CreateProduct = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/product/create-product`, payload);
        
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetProductsData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/product/get-all-products`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetProductDataByID = async (id) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/product/get-product-by-id/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const DeleteProduct = async (id) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_SERVER}/api/product/delete-product/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const EditProductById = async (payload , id) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER}/api/product/update-product/${id}`,payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}