import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { SetUser } from "../../redux/usersSlice";
import { SetLoader } from "../../redux/loadersSlice";
import { GetCurrentUser } from '../../apicalls/user';
import toast from 'react-hot-toast';
import { Spinner } from '@nextui-org/react';

const PrivateRoute = ({ children }) => {
    const { user } = useSelector((state) => state.users);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validateToken = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetCurrentUser();
            dispatch(SetLoader(false));

            if (response.success) {
                dispatch(SetUser(response.data));
            } else {
                if (response.message === "jwt expired") {
                    // Remove the token from localStorage
                    localStorage.removeItem("token");
                    // Redirect to login
                    navigate("/login");
                } else {
                    // Handle other errors
                    localStorage.removeItem("token");
                    navigate("/login");
                    console.log(response.message);
                }
            }
        } catch (error) {
            dispatch(SetLoader(false));
            // Remove the token from localStorage
            localStorage.removeItem("token");
            navigate("/login");
            console.log(response.message);
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
            {user ? (

                <div>
                    {children}
                </div>
            ) : (
                <div className="absolute backdrop-blur-sm z-[9999999] left-0 top-0  h-screen w-screen flex justify-center items-center">
                    <Spinner size='md' color="current" />
                </div>
            )
            }
        </>
    )
}


export default PrivateRoute;
