import React, { useEffect, useState } from 'react'
import { Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, } from "@nextui-org/react";
import Butoon from '../../components/ui/Butoon'
import Heading from '../../components/ui/Heading'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SetLoader } from "../../redux/loadersSlice";
import DataTableModel from '../../components/DateTableForModel/DataTableModel';
import { CreateTag, DeleteTag, GetTagData, UpdateTag } from '../../apicalls/tag';

const Tags = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [TagName, SetTagName] = useState("")
    const [updateTagId, setUpdateTagId] = useState(null)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [tagsData, setTagsData] = useState([])

    const getTagsData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetTagData();
            dispatch(SetLoader(false));
            if (response.success) {
                setTagsData(response.tag);
                console.log(tagsData)
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            toast.error(error.message)
        }
    }


    useEffect(() => {
        getTagsData();
    }, [setTagsData]);

    const isAttributeNameUnique = (name) => {
        const lowerCaseName = name.toLowerCase();
        return !tagsData.some((attribute) => attribute.name.toLowerCase() === lowerCaseName);
    };


    const columns = [
        { name: "NAME", uid: "name", },
        { name: "Created At", uid: "createdAt" },
        { name: "ACTIONS", uid: "actions" },
    ];

    // Add a callback function to reset the state when the modal is closed
    const handleCloseModal = () => {
        SetTagName("");
        setUpdateTagId(null);
    };

    // Update category function
    const handleDelete = async (categoryId) => {
        try {
            dispatch(SetLoader(true));
            const response = await DeleteTag(categoryId);
            dispatch(SetLoader(false));
            if (response.success) {
                toast.success(response.message);
                // Update categoryData to trigger useEffect
                setTagsData(prevData => prevData.filter(category => category._id !== categoryId));
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            console.log(error.message);
            toast.error(error.message);
        }
    };

    // Update category function
    const handleUpdate = async (categoryId) => {
        try {
            if (!isAttributeNameUnique(TagName)) {
                toast.error("Tag name must be unique.");
                return;
            }
            const response = await GetTagData(); // Fetch the latest category data
            if (response.success) {
                const existingTag = response.tag.find((cat) => cat._id === categoryId);
                if (!existingTag) {
                    throw new Error("Category not found");
                }

                // Open the modal for updating
                onOpen();
                console.log(existingTag.name)
                // Set the category name in the state for editing
                SetTagName(existingTag.name);


                // Save the category ID for the update function
                setUpdateTagId(categoryId);
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
            if (!isAttributeNameUnique(TagName)) {
                toast.error("Tag name must be unique.");
                return;
            }
            dispatch(SetLoader(true));

            // Call the update API with the updated data
            const response = await UpdateTag(updateTagId, {
                name: TagName,
            });

            dispatch(SetLoader(false));

            if (response.success) {
                toast.success(response.message);
                // Update categoryData to trigger useEffect
                setTagsData((prevData) =>
                    prevData.map((category) =>
                        category._id === updateTagId
                            ? { ...category, name: TagName }
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
            console.error("Error updating tag:", error.message);
            toast.error(error.message);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Use the 'formValues' object as needed, for example, send it to an API or perform other actions
        try {
            if (!isAttributeNameUnique(TagName)) {
                toast.error("Tag name must be unique.");
                return;
            }
            dispatch(SetLoader(true));
            const response = await CreateTag({ name: TagName });
            dispatch(SetLoader(false));
            if (response.success) {
                toast.success(response.message)
                setTagsData(prevData => [...prevData, { _id: response.tagDoc._id, name: response.tagDoc.name, createdAt: response.tagDoc.createdAt, actions: "" }]);
                navigate("/tags")
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
                            <ModalHeader className="flex flex-col gap-1">{updateTagId ? "Update Tag" : "Create Tag"}</ModalHeader>
                            <ModalBody>
                                <Input size={'sm'}
                                    classNames={{
                                        label: "font-bold font-3",
                                        input: "font-semibold font",
                                    }}

                                    type="text" label="Name"
                                    onChange={(e) => SetTagName(e.target.value)}
                                    value={TagName}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button onClick={updateTagId ? handleUpdateSubmit : handleSubmit} className='bg-[#000] text-[#fff]' onPress={onClose}>
                                    {updateTagId ? "Update" : "Create "}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <div className="flex items-center justify-between  border-b mx-4 md:mx-10 pb-3 py-5">
                <div className="flex-1 ">
                    <Heading title={`Tags (${tagsData.length})`} description="Manage Tags for your Products" />
                </div>
                <Butoon onOpen={onOpen} title={"Add New"} />
            </div >
            {Array.isArray(tagsData) && (
                <DataTableModel data={tagsData} setdata={setTagsData} columnss={columns} deleteitem={handleDelete} update={handleUpdate} />
            )}
        </>
    )
}

export default Tags
