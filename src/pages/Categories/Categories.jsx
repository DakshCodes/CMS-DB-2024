import React, { useEffect, useState } from 'react'
import { Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Select, SelectItem, Textarea, Switch, Tooltip, image, } from "@nextui-org/react";
import Butoon from '../../components/ui/Butoon'
import Heading from '../../components/ui/Heading'
import { CreateCategory, DeleteCategory, GetCategoryData, UpdateCategory } from '../../apicalls/category';
import { UploadImage } from '../../apicalls/user';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SetLoader } from "../../redux/loadersSlice";
import DataTableModel from '../../components/DateTableForModel/DataTableModel';
import { GetParentCategoryData } from '../../apicalls/parentCategory';
import axios from 'axios';

const Categories = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [CategoryName, SetCategoryName] = useState("")
    const [updateCategoryId, setUpdateCategoryId] = useState(null)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [categoryData, setCategoryData] = useState([])
    const [tableData, setTableData] = useState([]);
    const [selectedParentCategoryID, setSelectedParentCategoryID] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [hoverImage, setHoverImage] = useState(null);
    const [hoverImageLink, setHoverImageLink] = useState(null);
    const [mainImageLink, setMainImageLink] = useState(null);
    const [categoryDescription, setCategoryDescription] = useState("");
    const [visibility, setVisibility] = useState(true);


    const getCategoryData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetCategoryData();
            dispatch(SetLoader(false));
            if (response.success) {
                setCategoryData(response.category);
                console.log(categoryData)
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            toast.error(error.message)
        }
    }


    useEffect(() => {
        getCategoryData();
    }, [setCategoryData, updateCategoryId]);

    // console.log(categoryData.filter((item) => item._id === "65891a4c00533dad0822f172")[0].name);

    const columns = [
        // { name: "ID", uid: "_id", sortable: true },
        { name: "Hover Image", uid: "hoverImage", },
        { name: "Parent Category", uid: "parentCategory", },
        { name: "Name", uid: "name", },
        { name: "Visibility", uid: "isVisible", },
        { name: "Created At", uid: "createdAt" },
        { name: "Updated At", uid: "updatedAt" },
        { name: "ACTIONS", uid: "actions" },
    ];

    // Add a callback function to reset the state when the modal is closed
    const handleCloseModal = () => {
        SetCategoryName("");
        setUpdateCategoryId(null);
        setCategoryDescription("")
        setHoverImageLink(null);
        setMainImageLink(null);
        setVisibility(true);
    };

    // Update category function
    const handleDelete = async (categoryId) => {
        try {
            dispatch(SetLoader(true));
            const response = await DeleteCategory(categoryId);
            dispatch(SetLoader(false));
            if (response.success) {
                toast.success(response.message);
                // Update categoryData to trigger useEffect
                setCategoryData(prevData => prevData.filter(category => category._id !== categoryId));

            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            console.log(error.message);
            toast.error(error.message);
        }
    };



    console.log("---------------------->", selectedParentCategoryID)

    const handleMainImageChange = (e) => {
        setMainImage(e.target.files[0]);
    };

    const handleHoverImageChange = (e) => {
        setHoverImage(e.target.files[0]);
    };


    const uploadImage = async (e, imageType) => {
        e.preventDefault();
        try {
            dispatch(SetLoader(true));
            const formData = new FormData();
            const imageFile = imageType === 'main' ? mainImage : hoverImage;

            if (imageFile) {
                formData.append("product_images", imageFile);
                dispatch(SetLoader(true));
                const response = await UploadImage(formData);
                dispatch(SetLoader(false));

                if (response.success) {
                    toast.success(response.message);
                    const newImageLink = response.url;
                    if (imageType === 'main') {
                        setMainImageLink(newImageLink);
                    } else {
                        setHoverImageLink(newImageLink);
                    }
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


    // Update category function
    const handleUpdate = async (categoryId) => {
        try {
            const response = await GetCategoryData(); // Fetch the latest category data
            if (response.success) {
                const existingCategory = response.category.find((cat) => cat._id === categoryId);
                if (!existingCategory) {
                    throw new Error("Category not found");
                }


                console.log("______________________", existingCategory)
                // Open the modal for updating

                onOpen();
                setCategoryDescription(existingCategory.description);
                setHoverImageLink(existingCategory.hoverImage);
                setMainImageLink(existingCategory.mainImage);
                setVisibility(existingCategory.isVisible);
                SetCategoryName(existingCategory.name)
                setSelectedParentCategoryID(existingCategory?.parentCategory?._id || null)
                setUpdateCategoryId(categoryId);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Error updating category:", error.message);
        }
    };

    console.log("Table -> ", tableData)
    console.log("Parent Category -> ", selectedParentCategoryID)



    // Handle update form submission
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        console.log(prepareCategoryValues());


        const values = prepareCategoryValues();

        // Set parentCategory to null if it's an empty string
        if (values.parentCategory === '') {
            values.parentCategory = null;
        }

        try {
            dispatch(SetLoader(true));

            // Call the update API with the updated data
            const response = await UpdateCategory(updateCategoryId, values);

            dispatch(SetLoader(false));

            console.log(response);

            if (response.success) {
                toast.success(response.message);
                // Update categoryData to trigger useEffect
                setCategoryData((prevData) =>
                    prevData.map((category) =>
                        category._id === updateCategoryId
                            ? { ...category, name: CategoryName }
                            : category
                    )
                );

                // Close the modal
                navigate("/categories")
                onOpenChange(false);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            console.error("Error updating category:", error.message);
            toast.error(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input fields
        if (!CategoryName || !categoryDescription || !mainImage || !hoverImage) {
            toast.error('Please fill in all required fields and upload images.');
            return;
        }

        try {
            dispatch(SetLoader(true));
            const response = await CreateCategory(prepareCategoryValues());
            dispatch(SetLoader(false));

            console.log(response)
            console.log(response.data)

            if (response.success) {
                await getCategoryData();
                toast.success(response.message);
                // Do not navigate or close the modal on success
            } else {
                // Check if response.data has an error message
                const errorMessage = response.data?.error || response.data?.message || "An unknown error occurred";
                toast.error(errorMessage);
            }

        } catch (error) {
            dispatch(SetLoader(false));
            console.error(error);
            toast.error();
        }
    };


    const updatedCategory = categoryData.filter((item) => item._id !== updateCategoryId)


    // const [nameInfo, setNameInfo] = useState('');
    // let timeout;
    // const debounceCategoryName = () => {
    //     clearInterval(timeout);
    //     timeout = setTimeout(function () {
    //         handleCategoryName();
    //     }, 100);
    // }

    // const handleCategoryName = async (e) => {
    //     SetCategoryName(e.target.value);
    //     const res = await axios.post(`${process.env.VITE_SERVER_URL}/api/category/check-category-name?name=${e.target.value}`)
    //     const data = res.message;
    //     setNameInfo(data);
    // }


    const prepareCategoryValues = () => {

        const categoryValues = {
            name: CategoryName, // Add the name property
            description: categoryDescription, // Add the description property
            parentCategory: selectedParentCategoryID === 'null' ? null : selectedParentCategoryID, // Use the selectedParentCategoryID
            isVisible: visibility, // You may adjust this based on your requirements
            mainImage: mainImageLink, // Use the mainImageLink
            hoverImage: hoverImageLink, // Use the hoverImageLink
        };

        return categoryValues;
    };




    return (
        <>
            {/* category add model */}
            <Modal
                isOpen={isOpen}
                size='5xl'
                backdrop='opaque'
                scrollBehavior='inside'
                placement={"top-center"}
                className='h-[50rem] overflow-scroll'
                onOpenChange={(newState) => {
                    onOpenChange(newState);
                    if (!newState) {
                        handleCloseModal();
                    }
                }}

            >
                <ModalContent
                >
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{updateCategoryId ? "Update Category" : "Create Category"}</ModalHeader>

                            <ModalBody className='border '>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>

                                        <Input
                                            size={'md'}
                                            classNames={{
                                                label: "font-bold font-3",
                                                input: "font-semibold font",
                                            }}
                                            className='w-full my-4'
                                            type="text"
                                            value={CategoryName}
                                            label={`Name of Category`}
                                            onChange={(e) => SetCategoryName(e.target.value)}
                                        />

                                        <Textarea
                                            size={'md'}
                                            classNames={{
                                                label: "font-bold font-3",
                                                input: "font-semibold font",
                                            }}
                                            className='w-full my-4'
                                            type="textarea"
                                            label={`Description of Category`}
                                            value={categoryDescription}
                                            onValueChange={setCategoryDescription}

                                        />
                                        <div className="mb-4 border-black mt-6 gap-4 flex items-center">
                                            <div className='text-xl font-semibold'>Visibility</div>
                                            <Tooltip showArrow={true} color='secondary' placement="bottom-start" content="Do you want to make this category visible ? ">
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


                                        <select className="mt-4 outline-none w-full rounded-md border bg-[#f4f4f5] py-5 px-2" value={selectedParentCategoryID} onChange={(e) => setSelectedParentCategoryID(e.target.value)} name="" id="">
                                            <option value={"null"}>No parent Category</option>
                                            {
                                                updatedCategory.map((elem, index) => {
                                                    return (
                                                        <>
                                                            <option key={index} value={elem._id}>{elem.name}</option>
                                                        </>
                                                    )
                                                })
                                            }

                                        </select>

                                        {/* {updateCategoryId ? selectedParentCategoryID : ""} */}

                                        {/* <Select
                                            items={categoryData.filter((item) => item._id !== updateCategoryId)}
                                            variant="flat"
                                            placeholder={categoryData && categoryData.length > 0 ? selectedParentCategoryID : "No Parent Category Exists (defaut NULL)"}
                                            labelPlacement="inside"
                                            name='parentCategory'
                                            value={selectedParentCategoryID}
                                            classNames={{
                                                base: "w-full font-semibold font-black",
                                                trigger: "min-h-unit-12 py-2 font-sans",
                                            }}
                                            onChange={(e) => setSelectedParentCategoryID(e.target.value)}
                                        >
                                            {(parent) => (
                                                <SelectItem key={parent._id} textValue={parent.name}>
                                                    <span className="font-sans font-semibold">{parent.name}({parent._id})</span>
                                                </SelectItem>
                                            )}
                                        </Select> */}
                                        {/* {updateCategoryId ? <div className='font-bold mt-2'>Current Parent Category : {selectedParentCategoryID}</div> : null} */}



                                    </div>
                                    <div className="col-span-1 h-full w-full ">
                                        <div>
                                            <h1 className='font-extrabold my-2'>Main Image</h1>
                                            <div className='flex items-center justify-between'>
                                                <input
                                                    type="file"
                                                    onChange={handleMainImageChange}
                                                    className="hidden"
                                                    id="mainImageInput"
                                                    name="main_image"
                                                />
                                                <div className='flex gap-2'>

                                                    <label htmlFor="mainImageInput" className="text-center px-4 rounded-lg border border-black cursor-pointer">
                                                        Main Image
                                                    </label>

                                                    {mainImage?.name}
                                                </div>
                                                {
                                                    mainImageLink ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                                                            <path fill="#4caf50" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#ccff90" d="M34.602,14.602L21,28.199l-5.602-5.598l-2.797,2.797L21,33.801l16.398-16.402L34.602,14.602z"></path>
                                                        </svg>
                                                        :
                                                        <Button isLoading={false} className="font-sans ml-auto text-[#fff] bg-[#000] font-medium" onClick={(e) => uploadImage(e, 'main')} >
                                                            Upload
                                                        </Button>
                                                }
                                            </div>
                                        </div>

                                        <div className='my-4'>
                                            <h1 className='font-extrabold my-2'>Hover Image</h1>
                                            <div className='flex items-center justify-between'>
                                                <input
                                                    type="file"
                                                    onChange={handleHoverImageChange}
                                                    placeholder='Hover Image'
                                                    className="hidden"
                                                    id="hoverImageInput"
                                                    name="hover_image"
                                                />
                                                <div className='flex gap-2'>

                                                    <label htmlFor="hoverImageInput" className="text-center px-4 rounded-lg border border-black cursor-pointer">
                                                        Main Image
                                                    </label>

                                                    {hoverImage?.name}
                                                </div>
                                                {
                                                    hoverImageLink ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                                                            <path fill="#4caf50" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#ccff90" d="M34.602,14.602L21,28.199l-5.602-5.598l-2.797,2.797L21,33.801l16.398-16.402L34.602,14.602z"></path>
                                                        </svg>
                                                        :
                                                        <Button isLoading={false} className="font-sans ml-auto text-[#fff] bg-[#000] font-medium" onClick={(e) => uploadImage(e, 'hover')} >
                                                            Upload
                                                        </Button>
                                                }
                                            </div>
                                        </div>

                                        <div className='grid grid-cols-2 border border-gray-300 w-full h-fit gap-4 p-4 '>
                                            {
                                                hoverImageLink ?
                                                    <>
                                                        <div className='border rounded-md border-gray-500 p-2 flex flex-col items-center justify-center col-span-1 w-full min-h-full max-h-[13rem]'>
                                                            <img className='w-full h-full object-cover' src={hoverImageLink} alt="" />
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        <div className='border rounded-md text-center font-semibold border-black p-2  flex flex-col items-center justify-center col-span-1 w-full h-[13rem]'>
                                                            Hover Image will be shown here once uploaded !
                                                        </div>
                                                    </>
                                            }
                                            {
                                                mainImageLink ?
                                                    <>
                                                        <div className='border rounded-md border-gray-500  p-2  flex flex-col items-center justify-center col-span-1 w-full min-h-full max-h-[13rem]'>
                                                            <img className='!w-full !h-full object-cover' src={mainImageLink} alt="" />
                                                        </div>
                                                    </>

                                                    :
                                                    <>
                                                        <div className='border font-semibold text-center border-black p-2  flex flex-col items-center justify-center col-span-1 w-full h-[13rem]'>
                                                            Main Image will be shown here once uploaded !
                                                        </div>
                                                    </>
                                            }

                                            <div className='font-extrabold text-center w-full h-full border border-black'>Main Image</div>

                                            <div className='font-extrabold text-center w-full h-full border border-black'>Hover Image</div>




                                        </div>
                                    </div>
                                </div>
                            </ModalBody>


                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button onClick={updateCategoryId ? handleUpdateSubmit : handleSubmit} className='bg-[#000] text-[#fff]' onPress={onClose}>
                                    {updateCategoryId ? "Update" : "Create "}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
            <div className="flex items-center justify-between  border-b mx-4 md:mx-10 pb-3 py-5">
                <div className="flex-1 ">
                    <Heading title={`Categories (${categoryData.length})`} description="Manage categories for your store" />
                </div>
                <Butoon onOpen={onOpen} title={"Add New"} />
            </div >
            {
                Array.isArray(categoryData) && (
                    <DataTableModel data={categoryData} setdata={setCategoryData} columnss={columns} isOpen={isOpen} deleteitem={handleDelete} update={handleUpdate} />
                )
            }
        </>
    )
}

export default Categories
