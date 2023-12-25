import axios from "axios"

export const CreateCategory = async (payload) => {
    try {
        const response = await axios.post("http://localhost:5000/api/category/create-category", payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetCategoryData = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/category/get-all-category");
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const DeleteCategory = async (id) => {
    try {

        const response = await axios.delete(`http://localhost:5000/api/category/delete-category/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const UpdateCategory = async (id, payload) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/category/update-category/${id}`,payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
