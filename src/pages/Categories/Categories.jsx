import React, { useEffect, useState } from 'react'
import { Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Select, SelectItem, } from "@nextui-org/react";
import Butoon from '../../components/ui/Butoon'
import Heading from '../../components/ui/Heading'
import { CreateCategory, DeleteCategory, GetCategoryData, UpdateCategory } from '../../apicalls/category';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SetLoader } from "../../redux/loadersSlice";
import DataTableModel from '../../components/DateTableForModel/DataTableModel';
import { GetParentCategoryData } from '../../apicalls/parentCategory';

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
    const [parentCatgData, setParentCatgData] = useState([]);
    const [selectedParentCategoryID, setSelectedParentCategoryID] = useState(null);

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
        { name: "Parent Category", uid: "parentCategory", },
        { name: "SubCategories", uid: "subcategories", },
        { name: "Created At", uid: "createdAt" },
        { name: "Updated At", uid: "updatedAt" },
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
        const newSubcategories = subcategories.map((subcategory) => ({
            name: subcategory.name,
            items: subcategory.items,
        }));

        setTableData((prevData) => {
            const existingDataIndex = prevData.findIndex((data) => data.type === categoryName);

            if (existingDataIndex !== -1) {
                // Main category already exists, update its subcategories
                const updatedData = [...prevData];
                updatedData[existingDataIndex].value = [
                    ...updatedData[existingDataIndex].value,
                    ...newSubcategories,
                ];
                return updatedData;
            } else {
                // Main category doesn't exist, add it to tableData
                return [...prevData, { type: selectedParentCategoryID, value: newSubcategories }];
            }
        });


        // Reset the input fields after adding to the table
        SetCategoryName("");
        setSubcategories([{ name: "", items: [""] }]);
    };

    console.log("---------------------->", selectedParentCategoryID)



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

                console.log("______________________", existingCategory)
                // Open the modal for updating
                onOpen();

                const newTableData = existingCategory.subcategories.map((subcategory) => ({
                    type: existingCategory.parentCategory?._id || null,
                    value: [
                        {
                            name: subcategory.name,
                            items: subcategory.items,
                        },
                    ],
                }));

                // Update the state
                setTableData(newTableData);
                setSelectedParentCategoryID(existingCategory.parentCategory?.name || null)

                // console.log("table data =>  ", tableData)

                // Save the category ID for the update function
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

        try {
            dispatch(SetLoader(true));

            // Call the update API with the updated data
            const response = await UpdateCategory(updateCategoryId, prepareCategoryValues());

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
        // Use the 'formValues' object as needed, for example, send it to an API or perform other actions
        console.log("Table data ", tableData);
        console.log("Table data inside 1 level ", tableData.map(item => item.value));
        console.log("Table data inside the value", tableData.map(item =>
            item.value.forEach(elem => console.log(elem))
        ));

        console.log(prepareCategoryValues())

        setTimeout(async () => {


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

        }, [])

    };
    const prepareCategoryValues = () => {

        if (tableData.length === 0) {
            return null; // or handle the case where there is no data
        }

        const categoryValues = {
            parentCategory: tableData[0].type,
            subcategories: tableData.flatMap((category) =>
                category.value.map((subcategory) => ({
                    name: subcategory.name,
                    items: subcategory.items,
                }))
            ),
        };

        return categoryValues;
        // Send categoryValues to the backend API here




        // if (tableData.length === 0) {
        //     return null; // or handle the case where there is no data
        // }

        // const firstCategory = tableData;

        // const categoryValues = {
        //     name: firstCategory.type,
        //     subcategories: firstCategory.forEach((elem) => {
        //         elem.value.map((subcategory) => ({
        //             name: subcategory.name,
        //             items: subcategory.items,
        //         }))
        //     })
        //     // subcategories: firstCategory.value.map((subcategory) => ({
        //     //     name: subcategory.name,
        //     //     items: subcategory.items,
        //     // })),
        // };

        // return categoryValues;
        // Send categoryValues to the backend API here
    };


    const getParentCatgData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetParentCategoryData();
            dispatch(SetLoader(false));
            if (response.success) {
                setParentCatgData(response.parentCategory);
                console.log(response)
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            toast.error(error.message)
        }
    }


    useEffect(() => {
        getParentCatgData();
    }, []);


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


                                        <Select
                                            items={parentCatgData}
                                            variant="flat"
                                            placeholder={selectedParentCategoryID ? selectedParentCategoryID : "Parnet Category"}
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
                                                    <span className="font-sans font-semibold">{parent.name}</span>
                                                </SelectItem>
                                            )}
                                        </Select>

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
                                                                <div className='flex gap-2 mt-4'>

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
                                                        <TableCell>
                                                            {data.type ? (
                                                                parentCatgData
                                                                    .filter((item) => item._id === data.type)
                                                                    .map((matchedItem) => {
                                                                        console.log(matchedItem.name);
                                                                        return matchedItem.name;
                                                                    })[0] || "No Parent Category"
                                                            ) : (
                                                                "No Parent Category"
                                                            )}
                                                        </TableCell>

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
                    <DataTableModel data={categoryData} setdata={setCategoryData} columnss={columns} isOpen={isOpen} deleteitem={handleDelete} update={handleUpdate} />
                )
            }
        </>
    )
}

export default Categories
