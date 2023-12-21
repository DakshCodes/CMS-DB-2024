import React from 'react'
import {useFormik} from 'formik'
import '../LoginPage/LoginPage.css'
import { useNavigate } from "react-router-dom"
import { useEffect } from 'react'
import { loginValidate } from '../../utils/validate'
import { loginUser } from '../../apicalls/login'
const LoginPage = () => {
    const navigate = useNavigate();
     
    const logInOnFinish = async (values) => {
        try {
            
            const response = await loginUser(values);
            

            if (response) {
               
                localStorage.setItem("token", response);
                console.log(response)
                navigate("/")
            }

        } catch (error) {
            
            console.log(error)
            
        }
    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/")
        }
    }, [])

  const formik = useFormik({
    initialValues : {
      email : '',
      password : '',
    },
    // validate : loginValidate,
    validateOnBlur : false,
    validateOnChange : false,
    onSubmit : async values =>{
        logInOnFinish(values)
      // values.email = '';
      // values.password = '';
    },
     
  })

  return (
    <div className='container '>
 
      <div className='main w-screen flex items-center justify-center h-screen '>
         <div className=' glass flex items-center justify-center border-1 border-gray-500 shrink-0 h-3/4 w-[30%] rounded-3xl py-5 px-5 min-w-max ' >
       
       
        <form className='py-1' onSubmit={formik.handleSubmit} >
        <h4 className=' font-bold text-3xl text-center py-5' >Welcome</h4>
           
          <div className="textbox flex flex-col gap-2 justify-center items-center h-[30%]">
            <input {...formik.getFieldProps('email')} className=' rounded-xl border-0 shadow-sm w-full px-3 py-2 text-lg focus:outline-none ' type="text" placeholder='Email' />
            <input {...formik.getFieldProps('password')} className=' rounded-xl border-0 shadow-sm w-full px-3 py-2 text-lg focus:outline-none ' type="password" placeholder='password' />
            <button  className='submit-btn rounded-xl w-full py-4' type='submit'>Login</button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage