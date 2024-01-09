import axios from "axios"

export const CreateAttribute = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/attribute/create-attribute`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetAttributeData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/attribute/get-all-attribute`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const DeleteAttribute = async (id) => {
    try {

        const response = await axios.delete(`${import.meta.env.VITE_SERVER}/api/attribute/delete-attribute/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const UpdateAttribute = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER}/api/attribute/update-attribute/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
