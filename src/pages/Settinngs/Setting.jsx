import React, { useRef ,useState} from 'react';
import Heading from '../../components/ui/Heading';
import { Button, Input } from "@nextui-org/react";
import { useSelector } from 'react-redux';
import { useFormik } from 'formik'
import { UploadProfileImage, updateUser } from '../../apicalls/user';
import toast from 'react-hot-toast'
import { updateValidate } from '../../utils/validate';



const Setting = () => {
    const { user } = useSelector((state) => state.users);

    const formik = useFormik({
        initialValues: {
          username: user.username,
          email: user.email,
          password: '',
        },
    
        validate : updateValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            
            values = await Object.assign(values,{avatar:file})
        
          await updateUser(values , user._id).then(()=>{
              toast.success('user updated succesfully')
              window.location.reload();
          }).catch((error)=>{
            toast.error(error)
          })
       
         
        },
    
      })

    //   function handleFileInputChange(event) {
    //     const selectedFile = event.target.files[0];
    //     uploadImage(selectedFile);
    //    }

      const uploadImage = async (event) => {
        const selectedFile = event.target.files[0];
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append("profile_image", selectedFile);
            const response = await UploadProfileImage(formData);
            if (response.success) {
                toast.success('image uplaoded successfully')
                const url = response.url;
                setFile(url);
                setImg(url);

            } else {
                console.log(response.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const fileInputRef = useRef(null);

    const handleSelectPhoto = () => {
        fileInputRef.current.click();
    };
    const [file,setFile] = useState(user?.avatar);

    const[img,setImg]= useState(user?.avatar);

  
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-8 p-8 pt-6">
                <div className="flex items-center justify-between border-b pb-3">
                    <Heading title={"Store Setting"} description={"Manage Store Preference"} />
                </div>
                <form className="space-y-20 w-full">
                    <div className="max-w-fit flex flex-col gap-8 items-start">
                        <Input
                        {...formik.getFieldProps('username')}
                            type="email"
                            label="Name"
                            defaultValue={user?.username}
                            className="max-w-xs font-sans font-black "
                            classNames={{
                                label: "max-w-xs font-sans text-[#000] mb-1 font-black",
                                input: [
                                    "font-sans font-semibold"
                                ]
                            }}
                        />
                       
                        <Input
                        {...formik.getFieldProps('email')}
                            type="email"
                            label="Email"
                            disabled
                            // value={user.email}
                            description="We'll never share your email with anyone else."
                            classNames={{
                                label: "max-w-xs font-sans text-[#000] mb-1 font-black",
                                input: [
                                    "font-sans font-semibold"
                                ],
                                description: [
                                    "font-sans font-light"
                                ]
                            }}
                        />
                        <Input
                        {...formik.getFieldProps('password')}
                            type="password"
                            label="New Password"
                            description="We'll never share your password with anyone else."
                            classNames={{
                                label: "max-w-xs font-sans text-[#000] mb-1 font-black",
                                input: [
                                    "font-sans font-semibold"
                                ],
                                description: [
                                    "font-sans font-light"
                                ]
                            }}
                        />
                        {/* Photo File Input */}
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={uploadImage}
                        />
                        <div className="flex gap-2 justify-center items-center">
                            {/* Current Profile Photo */}
                            <div>
                                <img src={img} className="w-20 h-20 mx-auto rounded-full shadow" alt="Current Profile" />
                            </div>
                            <Button color={'default'} type="button"
                                variant='flat'
                                onClick={handleSelectPhoto}
                                className="mt-2 font-sans font-bold"
                            >
                                Select New Photo
                            </Button>
                        </div>
                    </div>
                    <Button isLoading={false} onClick={formik.handleSubmit} className="font-sans mx-auto text-[#fff] bg-[#000] font-bold" type="submit">
                        Save Changes
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Setting;
