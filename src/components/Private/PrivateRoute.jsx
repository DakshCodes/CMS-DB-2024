import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { SetUser } from "../../redux/usersSlice";
import { GetCurrentUser } from '../../apicalls/user';
import toast from 'react-hot-toast';

const PrivateRoute = ({ children }) => {
    const { user } = useSelector((state) => state.users);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validateToken = async () => {

        try {
            // dispatch(SetLoader(true));
            const response = await GetCurrentUser();
            // dispatch(SetLoader(false));
            // updateToken();


            if (response.success) {
                dispatch(SetUser(response.data))
            }
            else {
                if (response.message === "jwt expired") {
                    // Handle token expiration, e.g., redirect to login
                    navigate("/login");
                } else {
                    // Handle other errors
                    navigate("/login");
                    console.log(response.message)
                }
            }

        } catch (error) {
            // dispatch(SetLoader(false));
            navigate("/login")
            console.log(response.message)
        }
    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            validateToken();
        } else {
            toast.error("You are unauthorised to use this Website , Login to proceed");
            navigate("/login")
        }

    }, []);

    return (
        <>
            {user && (

                <div>
                    {children}
                </div>
            )}
        </>
    )
}


export default PrivateRoute;
