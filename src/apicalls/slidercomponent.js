import axios from "axios"

export const Createslidercom = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/slidercom/create-slidercom`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetslidercomData = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/slidercom/get-all-slidercom`);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const Deleteslidercom = async (id) => {
    try {


        const response = await axios.delete(`${import.meta.env.VITE_SERVER}/api/slidercom/delete-slidercom/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const Updateslidercom = async (id, payload) => {
    try {
        console.log(payload)
        const response = await axios.put(`${import.meta.env.VITE_SERVER}/api/slidercom/update-slidercom/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
