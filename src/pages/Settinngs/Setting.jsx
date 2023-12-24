import React, { useRef } from 'react';
import Heading from '../../components/ui/Heading';
import { Button, Input } from "@nextui-org/react";
import { useSelector } from 'react-redux';

const Setting = () => {
    const fileInputRef = useRef(null);
    const { user } = useSelector((state) => state.users);

    const handleSelectPhoto = () => {
        fileInputRef.current.click();
    };

    const handleFileInputChange = (event) => {
        const selectedFile = event.target.files[0];
        console.log('Selected file:', selectedFile);
    };

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-8 p-8 pt-6">
                <div className="flex items-center justify-between border-b pb-3">
                    <Heading title={"Store Setting"} description={"Manage Store Preference"} />
                </div>
                <form className="space-y-20 w-full">
                    <div className="max-w-fit flex flex-col gap-8 items-start">
                        <Input
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
                            type="email"
                            label="Email"
                            defaultValue={user?.email}
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
                            onChange={handleFileInputChange}
                        />
                        <div className="flex gap-2 justify-center items-center">
                            {/* Current Profile Photo */}
                            <div>
                                <img src={user?.avatar} className="w-20 h-20 mx-auto rounded-full shadow" alt="Current Profile" />
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
                    <Button isLoading={false} className="font-sans mx-auto text-[#fff] bg-[#000] font-bold" type="submit">
                        Save Changes
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Setting;
