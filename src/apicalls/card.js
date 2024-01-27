import axios from "axios";

const serverURL = import.meta.env.VITE_SERVER;

export const getAllCards = async () => {
    try {
        const response = await axios.get(`${serverURL}/api/card/get-all-cards`);
        return response.data;
    } catch (error) {
        console.error(error.message);
        return { success: false, message: "Failed to fetch cards" };
    }
};

export const createCard = async (payload) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/card/create-card`, payload);
        return response.data;

    } catch (error) {
        return error.message
    }
}
export const updateCardById = async (cardId, payload) => {
    try {
        const response = await axios.put(`${serverURL}/api/card/update-card/${cardId}`, payload);
        return response.data;
    } catch (error) {
        console.error(error.message);
        return { success: false, message: "Failed to update the card" };
    }
};

export const deleteCardById = async (cardId) => {
    try {
        const response = await axios.delete(`${serverURL}/api/card/delete-card/${cardId}`);
        return response.data;
    } catch (error) {
        console.error(error.message);
        return { success: false, message: "Failed to delete the card" };
    }
};
