import React, { useEffect, useState } from 'react'
import { Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, } from "@nextui-org/react";
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Use the 'formValues' object as needed, for example, send it to an API or perform other actions
        try {
            dispatch(SetLoader(true));
            const response = await CreateCategory({ name: CategoryName });
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
                            <ModalHeader className="flex flex-col gap-1">{updateCategoryId ? "Update Category" : "Create Category"}</ModalHeader>
                            <ModalBody>
                                <Input size={'sm'}
                                    classNames={{
                                        label: "font-bold font-3",
                                        input: "font-semibold font",
                                    }}

                                    type="text" label="Name"
                                    onChange={(e) => SetCategoryName(e.target.value)}
                                    value={CategoryName}
                                />
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
            </Modal>
            <div className="flex items-center justify-between  border-b mx-4 md:mx-10 pb-3 py-5">
                <div className="flex-1 ">
                    <Heading title={`Categories (${categoryData.length})`} description="Manage categories for your store" />
                </div>
                <Butoon onOpen={onOpen} title={"Add New"} />
            </div >
            {Array.isArray(categoryData) && (
                <DataTableModel data={categoryData} setdata={setCategoryData} columnss={columns} deleteitem={handleDelete} update={handleUpdate} />
            )}
        </>
    )
}

export default Categories
