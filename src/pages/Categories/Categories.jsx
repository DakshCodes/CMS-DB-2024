import React, { useEffect, useState } from 'react'
import { Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, } from "@nextui-org/react";
import Butoon from '../../components/ui/Butoon'
import Heading from '../../components/ui/Heading'
import { CreateCategory, DeleteCategory, GetCategoryData, UpdateCategory } from '../../apicalls/category';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SetLoader } from "../../redux/loadersSlice";
import DataTableModel from '../../components/DateTableForModel/DataTableModel';

const Categories = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [CategoryName, SetCategoryName] = useState("")
    const [updateCategoryId, setUpdateCategoryId] = useState(null)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [categoryData, setCategoryData] = useState([])
    const [categoryName, setCategoryName] = useState(""); // State to hold main category name
    const [subcategories, setSubcategories] = useState([{ name: "", items: [""] }]);
    const [tableData, setTableData] = useState([]);



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
    }, [setCategoryData]);

    // console.log(categoryData.filter((item) => item._id === "65891a4c00533dad0822f172")[0].name);

    const columns = [
        // { name: "ID", uid: "_id", sortable: true },
        { name: "NAME", uid: "name", },
        { name: "Created At", uid: "createdAt" },
        { name: "ACTIONS", uid: "actions" },
    ];

    // Add a callback function to reset the state when the modal is closed
    const handleCloseModal = () => {
        SetCategoryName("");
        setUpdateCategoryId(null);
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

    const handleDeleteItem = (subIndex, itemIndex) => {
        const updatedSubcategories = [...subcategories];
        updatedSubcategories[subIndex].items.splice(itemIndex, 1);
        setSubcategories(updatedSubcategories);
    };

    const handleAddToTable = () => {
        // Check if the main category already exists in tableData
        const existingDataIndex = tableData.findIndex((data) => data.type === categoryName);

        if (existingDataIndex !== -1) {
            // Main category already exists, update its subcategories
            const updatedTableData = [...tableData];
            updatedTableData[existingDataIndex].value = [
                ...updatedTableData[existingDataIndex].value,
                ...subcategories.map((subcategory) => ({
                    name: subcategory.name,
                    items: subcategory.items,
                })),
            ];

            setTableData(updatedTableData);
        } else {
            // Main category doesn't exist, add it to tableData
            const newData = {
                type: categoryName,
                value: subcategories.map((subcategory) => ({
                    name: subcategory.name,
                    items: subcategory.items,
                })),
            };
            setTableData([...tableData, newData]);
        }

        // Reset the input fields after adding to the table
        SetCategoryName("");
        setSubcategories([{ name: "", items: [""] }]);
    };

    const removeAttributeFromTable = (index) => {
        const newTableData = [...tableData];
        newTableData.splice(index, 1);
        setTableData(newTableData);

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

                // Open the modal for updating
                onOpen();
                console.log(existingCategory.name)
                // Set the category name in the state for editing
                SetCategoryName(existingCategory.name);


                // Save the category ID for the update function
                setUpdateCategoryId(categoryId);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Error updating category:", error.message);
        }
    };

    // Handle update form submission
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        try {
            dispatch(SetLoader(true));

            // Call the update API with the updated data
            const response = await UpdateCategory(updateCategoryId, {
                name: CategoryName,
            });

            dispatch(SetLoader(false));

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
        // Use the 'formValues' object as needed, for example, send it to an API or perform other actions
        console.log(prepareCategoryValues())
        try {
            dispatch(SetLoader(true));
            const response = await CreateCategory(prepareCategoryValues());
            dispatch(SetLoader(false));
            if (response.success) {
                toast.success(response.message)
                setCategoryData(prevData => [...prevData, { _id: response.categoryDoc._id, name: response.categoryDoc.name, createdAt: response.categoryDoc.createdAt, actions: "" }]);
                navigate("/categories")
            }
            else {
                throw new Error(response.message);
            }

        } catch (error) {
            dispatch(SetLoader(false));
            console.log(error.message)
            toast.error(error.message)
        }
    };
    const prepareCategoryValues = () => {
        const categoryValues = tableData.map((data) => ({
            name: data.type,
            subcategories: data.value.map((subcategory) => ({
                name: subcategory.name,
                items: subcategory.items,
            })),
        }));

        return categoryValues;
        // Send categoryValues to the backend API here
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
                className='h-[50rem] overflow-scroll border border-black'
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
                                            size={'sm'}
                                            classNames={{
                                                label: "font-bold font-3",
                                                input: "font-semibold font",
                                            }}
                                            className=''
                                            type="text"
                                            label="Main Category Name (eg. Mens)"
                                            onChange={(e) => setCategoryName(e.target.value)}
                                            value={categoryName}
                                        />

                                        <div className="mb-4  border-black mt-6">
                                            <label className="font-bold font-3 mt-4">Subcategories</label>
                                            <div className='flex'>

                                                {subcategories.map((subcategory, subIndex) => (
                                                    <div key={subIndex} className="mb-2 w-full">
                                                        <Input
                                                            size={'md'}
                                                            classNames={{
                                                                label: "font-bold font-3",
                                                                input: "font-semibold font",
                                                            }}
                                                            className='w-full mt-4'
                                                            type="text"
                                                            label={`Subcategory ${subIndex + 1}`}
                                                            value={subcategory.name}
                                                            onChange={(e) => {
                                                                const updatedSubcategories = [...subcategories];
                                                                updatedSubcategories[subIndex].name = e.target.value;
                                                                setSubcategories(updatedSubcategories);
                                                            }}
                                                        />

                                                        <div className="ml-4 mt-6">
                                                            <label className="font-bold font-3 mt-6">Items</label>
                                                            {subcategory.items.map((item, itemIndex) => (
                                                                <div className='flex gap-2 border mt-4'>

                                                                    <Input
                                                                        key={itemIndex}
                                                                        size={'sm'}
                                                                        classNames={{
                                                                            label: "font-bold font-3",
                                                                            input: "font-semibold font",
                                                                        }}
                                                                        type="text"

                                                                        label={`Item ${itemIndex + 1}`}
                                                                        value={item}
                                                                        onChange={(e) => {
                                                                            const updatedSubcategories = [...subcategories];
                                                                            updatedSubcategories[subIndex].items[itemIndex] = e.target.value;
                                                                            setSubcategories(updatedSubcategories);
                                                                        }}
                                                                    />

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDeleteItem(subIndex, itemIndex)}
                                                                        className="bg-black text-white w-fit px-4 py-2 rounded ml-2"
                                                                    >
                                                                        -
                                                                    </button>
                                                                </div>
                                                            ))}

                                                            <div className='flex gap-4'>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const updatedSubcategories = [...subcategories];
                                                                        updatedSubcategories[subIndex].items.push("");
                                                                        setSubcategories(updatedSubcategories);
                                                                    }}
                                                                    className="bg-black text-sm text-white px-4 py-2 rounded mt-4"
                                                                >
                                                                    Add Item
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={handleAddToTable}
                                                                    className="bg-black text-white px-4 py-2 rounded mt-4"
                                                                >
                                                                    Add to Table
                                                                </button>

                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {/* <button
                                                    type="button"
                                                    onClick={() => setSubcategories([...subcategories, { name: "", items: [""] }])}
                                                    className="bg-green-500 h-fit text-white px-2 py-1 rounded"
                                                >
                                                    Add Subcategory
                                                </button> */}
                                            </div>

                                        </div>

                                    </div>
                                    <div className="col-span-1 h-full w-full border">
                                        {/* Display Table Here */}
                                        {console.log(-tableData)}
                                        <Table
                                            classNames={{
                                                base: "max-h-[100%] overflow-scroll",
                                                table: "min-h-[70px]",
                                            }}
                                            aria-label="Categories Table"
                                        >
                                            <TableHeader>
                                                <TableColumn>Main Category</TableColumn>
                                                <TableColumn>Subcategories</TableColumn>
                                                <TableColumn>Items</TableColumn>
                                                <TableColumn>ACTIONS</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                {tableData.map((data, index) => (
                                                    
                                                    <TableRow key={index}>
                                                        <TableCell>{data.type}</TableCell>
                                                        <TableCell>
                                                            {data.value.map((subcategory, subIndex) => (
                                                                <div key={subIndex}>
                                                                    <p className='bold'>{subcategory.name}</p>
                                                                </div>
                                                            ))}
                                                        </TableCell>
                                                        <TableCell>
                                                            {data.value.map((subcategory, subIndex) => (
                                                                <div key={subIndex}>
                                                                    <ul className='list-disc'>
                                                                        {subcategory.items.map((item, itemIndex) => (
                                                                            <li key={itemIndex}>{item}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            ))}
                                                        </TableCell>
                                                        <TableCell className='flex gap-4'>
                                                            {/* Edit and delete buttons for each row */}
                                                            <span
                                                                className="text-lg text-danger cursor-pointer active:opacity-50 inline-block"
                                                                onClick={() => removeAttributeFromTable(index)}
                                                            >
                                                                {/* SVG for delete */}
                                                                <svg
                                                                    aria-hidden="true"
                                                                    fill="none"
                                                                    focusable="false"
                                                                    height="1em"
                                                                    role="presentation"
                                                                    viewBox="0 0 20 20"
                                                                    width="1em"
                                                                >
                                                                    <path
                                                                        d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
                                                                        stroke="currentColor"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={1.5}
                                                                    />
                                                                    <path
                                                                        d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
                                                                        stroke="currentColor"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={1.5}
                                                                    />
                                                                    <path
                                                                        d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
                                                                        stroke="currentColor"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={1.5}
                                                                    />
                                                                    <path
                                                                        d="M8.60834 13.75H11.3833"
                                                                        stroke="currentColor"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={1.5}
                                                                    />
                                                                    <path
                                                                        d="M7.91669 10.4167H12.0834"
                                                                        stroke="currentColor"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={1.5}
                                                                    />
                                                                </svg>
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>

                                            
                                        </Table>
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
                    <DataTableModel data={categoryData} setdata={setCategoryData} columnss={columns} deleteitem={handleDelete} update={handleUpdate} />
                )
            }
        </>
    )
}

export default Categories
