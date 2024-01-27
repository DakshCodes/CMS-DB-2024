import axios from "axios"

export const CreateBanner = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/banner/create-banner`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}

// Get all banners
export const GetAllBanners = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/banner/get-all-banners`);
        return response.data;

    } catch (error) {
        return error.message;
    }
}

// Get banner by ID
export const GetBannerById = async (id) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/banner/get-banner/${id}`);
        return response.data;

    } catch (error) {
        return error.message;
    }
}

// Update banner by ID
export const UpdateBannerById = async (id, payload) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_SERVER}/api/banner/update-banner/${id}`, payload);
        return response.data;

    } catch (error) {
        return error.message;
    }
}

// Delete banner by ID
export const DeleteBannerById = async (id) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_SERVER}/api/banner/delete-banner/${id}`);
        return response.data;

    } catch (error) {
        return error.message;
    }
}