import axios from "axios"

export const Createlayoutimg = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/layoutimg/create-layoutimg`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetlayoutimgData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/layoutimg/get-all-layoutimg`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deletelayoutimg = async (id) => {
    try {


        const response = await axios.delete(`${import.meta.env.VITE_SERVER}/api/layoutimg/delete-layoutimg/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updatelayoutimg = async (id, payload) => {
    try {
        console.log(payload)
        const response = await axios.put(`${import.meta.env.VITE_SERVER}/api/layoutimg/update-layoutimg/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
