import axios from "axios"

export const CreateParentCategory = async (payload) => {
    try {
        const response = await axios.post("http://localhost:5000/api/parentCategory/create-ParentCategory", payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const GetParentCategoryData = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/parentCategory/get-all-parentCategory");
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const DeleteParentCategory = async (id) => {
    try {

        const response = await axios.delete(`http://localhost:5000/api/parentCategory/delete-parentCategory/${id}`);
        return response.data;

    } catch (error) {
        return error.message
    }
}

export const UpdateParentCategory = async (id, payload) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/parentCategory/update-parentCategory/${id}`,payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
