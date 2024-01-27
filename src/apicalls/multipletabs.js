import axios from "axios"

export const Createmultitabs = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/multitabs/create-multitabs`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetmultitabsData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/multitabs/get-all-multitabs`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deletemultitabs = async (id) => {
    try {


        const response = await axios.delete(`${import.meta.env.VITE_SERVER}/api/multitabs/delete-multitabs/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updatemultitabs = async (id, payload) => {
    try {
        console.log(payload)
        const response = await axios.put(`${import.meta.env.VITE_SERVER}/api/multitabs/update-multitabs/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
