import axios from "axios"

export const CreateAttribute = async (payload) => {
    try {
        const response = await axios.post("http://localhost:5000/api/attribute/create-attribute", payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetAttributeData = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/attribute/get-all-attribute");
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const DeleteAttribute = async (id) => {
    try {

        const response = await axios.delete(`http://localhost:5000/api/attribute/delete-attribute/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const UpdateAttribute = async (id, payload) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/attribute/update-attribute/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
