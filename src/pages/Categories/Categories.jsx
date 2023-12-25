import React, { useEffect, useState } from 'react'
import { Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, } from "@nextui-org/react";
import DataTable from '../../components/DataTable/DataTable'
import Butoon from '../../components/ui/Butoon'
import Heading from '../../components/ui/Heading'
import { CreateCategory, GetCategoryData } from '../../apicalls/category';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SetLoader } from "../../redux/loadersSlice";

const Categories = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [CategoryName, SetCategoryName] = useState("")
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [categoryData, setCategoryData] = useState([])

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

    console.log(categoryData,"data")
    useEffect(() => {
        getCategoryData();
    }, []);

    const columns = [
        // { name: "ID", uid: "_id", sortable: true },
        { name: "NAME", uid: "name", },
        { name: "Created At", uid: "createdAt" },
        { name: "ACTIONS", uid: "actions" },
    ];

    const users = [
        {
            id: 1,
            name: "Mens",
            date: "2023-13-12",
        },
        {
            id: 2,
            name: "Womens",
            date: "2021-10-12",
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Use the 'formValues' object as needed, for example, send it to an API or perform other actions
        try {
            dispatch(SetLoader(true));
            const response = await CreateCategory({ name: CategoryName });
            dispatch(SetLoader(false));
            if (response.success) {
                toast.success(response.message)
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

    const deleteItem = (id) =>{
        console.log("I am from categories" + id)
    }


    return (
        <>
            {/* category add model */}
            <Modal
                isOpen={isOpen}
                placement={"top-center"}
                onOpenChange={onOpenChange}

            >
                <ModalContent
                >
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Create Category</ModalHeader>
                            <ModalBody>
                                <Input size={'sm'}
                                    classNames={{
                                        label: "font-bold font-3",
                                        input: "font-semibold font",
                                    }}

                                    type="text" label="Name"
                                    onChange={(e) => SetCategoryName(e.target.value)}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button onClick={handleSubmit} className='bg-[#000] text-[#fff]' onPress={onClose}>
                                    Create
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <div className="flex items-center justify-between  border-b mx-4 md:mx-10 pb-3 py-5">
                <div className="flex-1 ">
                    <Heading title={`Categories (0)`} description="Manage categories for your store" />
                </div>
                <Butoon onOpen={onOpen} title={"Add New"} />
            </div >
            <DataTable data={categoryData} deleteItem={deleteItem} columnss={columns} />
        </>
    )
}

export default Categories
