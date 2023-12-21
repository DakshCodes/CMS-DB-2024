import axios from "axios"
// import toast from "react-hot-toast"
export const loginUser = async(payload)=>{
    try {
        const response = await axios.post("http://localhost:5000/api/login",payload);
        return response.data;
    //    response.data = toast.success('email sent sucessfully');
    } catch (error) {
        return error.message 
    }
}