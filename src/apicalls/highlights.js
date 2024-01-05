import axios from "axios"

export const CreateHighlight = async (payload) => {
    try {
        const response = await axios.post("http://localhost:5000/api/highlight/create-highlight", payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetHighlightData = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/highlight/get-all-highlight");
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const DeleteHighlight = async (id) => {
    try {

        const response = await axios.delete(`http://localhost:5000/api/highlight/delete-highlight/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const UpdateHighlight = async (id, payload) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/highlight/update-highlight/${id}`,payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
