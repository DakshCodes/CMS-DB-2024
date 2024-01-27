import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Switch, Tooltip } from '@nextui-org/react'
import React, { useState } from 'react'
import { UploadImage } from '../../apicalls/user'
import { SetLoader } from '../../redux/loadersSlice'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { CreateBanner } from '../../apicalls/banner'

const BannerForm = ({ isOpen, onOpenChange ,getData,
    selectedBannerVersion,
    bannerImage,
    overlayImage,
    overlayImagesLink,
    bannerImageLink,
    visibility,
    overlayImageVisibility,
    setSelectedBannerVersion,
    setBannerImage,
    setOverlayImage,
    setOverlayImagesLink,
    setBannerImageLink,
    setVisibility,
    setOverlayImageVisibility,
}) => {
     // Initial visibility for 3 overlay images
    const dispatch = useDispatch();


    const handleBannerImageChange = (e) => {
        setBannerImage(e.target.files[0]);
        console.log(e.target.files[0])
    };

    const handleOverlayImageChange = (e) => {
        setOverlayImage(e.target.files[0]);
        console.log(e.target.files[0])
    };

    // const handleHoverImageChange = (e) => {
    //     setHoverImage(e.target.files[0]);
    // };

    const handleOverlayImageVisibilityChange = (index) => {
        setOverlayImageVisibility((prevVisibility) => {
            const updatedVisibility = [...prevVisibility];
            updatedVisibility[index] = !updatedVisibility[index];
            return updatedVisibility;
        });
    };

    const handleSubmit = async (e) => {
        // e.preventDefault();
        const bannerData = {
            bannerImageLink,
            isVisible: visibility,
            overlayImages: overlayImagesLink.map((image, index) => ({
                imageLink: image,
                isVisible: overlayImageVisibility[index],
            })),
        };

        console.log(bannerData)

        try {
            dispatch(SetLoader(true));
            const response = await CreateBanner(bannerData);
            dispatch(SetLoader(false));

            console.log(response)

            if (response.success) {
                toast.success(response.message);
                getData();
                onOpenChange(false);
            } else {
                toast.error(response.error);
            }

        } catch (error) {
            dispatch(SetLoader(false));
            console.error(error);
            toast.error();
        }

    };


    const uploadImage = async (e) => {
        e.preventDefault();
        try {
            dispatch(SetLoader(true));
            const formData = new FormData();
            const imageFile = selectedBannerVersion ? bannerImage : overlayImage;

            if (imageFile) {
                formData.append("product_images", imageFile);
                dispatch(SetLoader(true));
                const response = await UploadImage(formData);
                dispatch(SetLoader(false));

                if (response.success) {
                    toast.success(response.message);
                    const newImageLink = response.url;
                    if (selectedBannerVersion) {
                        setBannerImageLink(newImageLink);
                    } else {
                        setOverlayImagesLink((prevImages) => [...prevImages, newImageLink]);
                    }
                setOverlayImage('')
                } else {

                    console.log(response.message);
                }
            } else {
                dispatch(SetLoader(false));
                // Handle the case where the image file is not selected
                toast.error('Please select an image file.');
            }
        } catch (error) {
            dispatch(SetLoader(false));
            toast.error(error.message);
            console.log(error.message);
        }
    };

    console.log(selectedBannerVersion)


    return (
        <>

            <Modal
                isOpen={isOpen}
                placement={"top-center"}
                size='4xl'
                className='max-h-[80%] overflow-scroll'
                onOpenChange={onOpenChange}
            >
                <ModalContent
                >
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Add Banner</ModalHeader>
                            <ModalBody>
                                <div className='flex flex-col gap-4'>
                                    <div className='flex items-center w-full gap-4'>
                                        <span className='font-semibold'>Choose the banner version : </span>
                                        <select
                                            value={selectedBannerVersion}
                                            className='p-2 outline-none font-semibold border-2 border-gray-400 rounded-md'
                                            onChange={(e) => setSelectedBannerVersion(e.target.value === 'true')}
                                            name=""
                                            id=""
                                        >
                                            <option value="">Select</option>
                                            <option value="true">Single Banner</option>
                                            <option value="false">Single Banner with 3 overlay images</option>
                                        </select>

                                    </div>

                                    <div className="mb-4 border-black mt-6 gap-4 flex items-center">
                                        <div className='text-xl font-semibold'>Visibility</div>
                                        <Tooltip showArrow={true} color='secondary' placement="bottom-start" content="Do you want to make this banner component visible in main website ? ">
                                            <svg className="w-6 h-6 hover:cursor-pointer text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                            </svg>
                                        </Tooltip>
                                        <Switch
                                            defaultSelected={visibility}
                                            size="lg"
                                            color='secondary'
                                            onChange={() => setVisibility(!visibility)}
                                        >
                                            {visibility ? 'yes' : 'no'}
                                        </Switch>
                                    </div>

                                    <div className='font-semibold'>Step - 1 <span className='italic text-sm text-gray-600'>(Insert the banner image in this step)</span></div>

                                    <div className='grid grid-cols-5 '>
                                        <input
                                            type="file"
                                            onChange={(e) => handleBannerImageChange(e)}
                                            className="hidden"
                                            id="bannerImageInput"
                                            name="banner_image"
                                        />
                                        <div className='flex gap-2 col-span-4'>

                                            <label htmlFor="bannerImageInput" className="font-semibold flex items-center justify-center text-center w-full h-full rounded-lg border border-black cursor-pointer">
                                                Select Banner Image ({bannerImage.name})
                                            </label>

                                            {/* {mainImage?.name} */}
                                        </div>

                                        {
                                            bannerImageLink ?
                                                <div className='col-span-1 flex items-center justify-center'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                                                        <path fill="#4caf50" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#ccff90" d="M34.602,14.602L21,28.199l-5.602-5.598l-2.797,2.797L21,33.801l16.398-16.402L34.602,14.602z"></path>
                                                    </svg>
                                                </div>
                                                :
                                                <Button isLoading={false} className="font-sans ml-auto col-span-1 text-[#fff] bg-[#000] font-medium" onClick={(e) => uploadImage(e)} >
                                                    Upload
                                                </Button>
                                        }
                                    </div>
                                    {
                                        bannerImageLink ? <img className='w-[1280px] h-[200px] object-contain' src={bannerImageLink} alt="" /> : <div className='w-full h-[200px] border-2 font-semibold flex items-center justify-center'>Your Banner Image appear here once uploaded</div>
                                    }

                                    {/* Single Banner -> True  , and Sinle Banner with overlay images */}



                                    {(selectedBannerVersion === false) && (
                                        <>
                                            <div className='font-semibold'>Step - 2 <span className='italic text-sm text-gray-600'>(Insert 3 overlay images in this step)</span></div>
                                            <div className='grid'>
                                                <div className='flex gap-4 flex-col items-center justify-center'>
                                                    <input
                                                        type='file'
                                                        onChange={(e) => handleOverlayImageChange(e)}
                                                        className='hidden'
                                                        id={`overlay_image_${overlayImagesLink.length < 3 && overlayImagesLink.length + 1}Input`}
                                                        name={`overlay_image_${overlayImagesLink.length + 1}`}
                                                    />
                                                    <div className='flex w-full gap-2 col-span-4'>
                                                        <label
                                                            htmlFor={`overlay_image_${overlayImagesLink.length + 1}Input`}
                                                            className='font-semibold flex items-center justify-center text-center w-full h-full p-4 rounded-lg border border-black cursor-pointer'
                                                        >
                                                            Select Overlay Image {overlayImagesLink.length + 1} ({overlayImage?.name})
                                                        </label>
                                                    </div>
                                                    {
                                                        overlayImagesLink.length === 3 ?
                                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                                                                <path fill="#4caf50" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#ccff90" d="M34.602,14.602L21,28.199l-5.602-5.598l-2.797,2.797L21,33.801l16.398-16.402L34.602,14.602z"></path>
                                                            </svg>
                                                            :
                                                            <Button isLoading={false} className="font-sans  col-span-1 text-[#fff] bg-[#000] font-medium" onClick={(e) => uploadImage(e)} >
                                                                Upload
                                                            </Button>
                                                    }

                                                </div>

                                            </div>


                                            <div className='grid grid-cols-3 place-items-center py-3 gap-4 border-2'>
                                                {
                                                    overlayImagesLink.length >= 1 ?
                                                        overlayImagesLink.map((item, index) => {
                                                            return (
                                                                <div className='flex flex-col items-center'>
                                                                    <img className='w-[200px] col-span-1 b h-[200px] object-cover' src={item} alt="" />

                                                                    <div className="mb-4 border-black mt-6 gap-4 flex items-center">
                                                                        {/* <div className='text-xl font-semibold'>Visibility</div> */}
                                                                        <Tooltip showArrow={true} color='secondary' placement="bottom-start" content="Do you want to make this overlay Image visible in main website ? ">
                                                                            <svg className="w-6 h-6 hover:cursor-pointer text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                                                            </svg>
                                                                        </Tooltip>
                                                                        <Switch
                                                                            defaultSelected={overlayImageVisibility[index]}
                                                                            size="lg"
                                                                            color='secondary'
                                                                            onChange={() => handleOverlayImageVisibilityChange(index)}
                                                                        >
                                                                            {overlayImageVisibility[index] ? 'yes' : 'no'}
                                                                        </Switch>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                        :
                                                        <div className='w-[100%] mx-auto h-[200px] border-2 font-semibold flex items-center justify-center'>Your Cover Images appear here once uploaded</div>
                                                }
                                            </div>
                                        </>

                                    )}

                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button className='bg-[#000] text-[#fff]' onPress={(e)=>handleSubmit(e)}>
                                    Submit
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default BannerForm
