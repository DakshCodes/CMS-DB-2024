import axios from "axios"

export const CreateBanner = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/banner/create-banner`, payload);
        return response;

    } catch (error) {
        return error.message
    }
}

// export const GetCategoryData = async () => {
//     try {
//         const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/category/get-all-category`);
//         return response.data;

//     } catch (error) {
//         return error.message
//     }
// }
// export const DeleteCategory = async (id) => {
//     try {

//         const response = await axios.delete(`${import.meta.env.VITE_SERVER}/api/category/delete-category/${id}`);
//         return response.data;

//     } catch (error) {
//         return error.message
//     }
// }

// export const UpdateCategory = async (id, payload) => {
//     try {
//         const response = await axios.put(`${import.meta.env.VITE_SERVER}/api/category/update-category/${id}`,payload);
//         return response.data;

//     } catch (error) {
//         return error.message
//     }
// }
