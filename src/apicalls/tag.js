import axios from "axios"

export const CreateTag = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/tag/create-tag`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetTagData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/tag/get-all-tag`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const DeleteTag = async (id) => {
    try {

        const response = await axios.delete(`${import.meta.env.VITE_SERVER}/api/tag/delete-tag/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const UpdateTag = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER}/api/tag/update-tag/${id}`,payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
