import axios from "axios"

export const Createfrontlayout = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/frontlayout/create-frontlayout`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetfrontlayoutData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/frontlayout/get-all-frontlayout`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deletefrontlayout = async (id) => {
    try {

        const response = await axios.delete(`${import.meta.env.VITE_SERVER}/api/frontlayout/delete-frontlayout/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updatefrontlayout = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER}/api/frontlayout/update-frontlayout/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
