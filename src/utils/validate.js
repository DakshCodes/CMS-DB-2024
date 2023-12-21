function passwordVerify(error = {} , values){

    const specialChar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        if (!values.password){
         error.password = toast.error('password required ....')
        }
        else if (values.password.includes(" ")){
         error.password = toast.error('password invalid ....')  
        }
        else if (values.password.length<5){
            error.password= toast.error('password must be contain more than 4 character ....')  
           }
           else if (!specialChar.test(values.password)){
            error.password = toast.error('password must have special character ....')  
           }
        return error;
}

export async function loginValidate(values){
    emailVerify(errors ,values)
    passwordVerify(errors , values);
    return errors;
    
}
function emailVerify(error = {},values){
    if(!values.email){
        error.email = toast.error('email required...')
    }
    
    if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        error.email = toast.error('wrong email...')
    }
}