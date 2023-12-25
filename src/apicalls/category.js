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