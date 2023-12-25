import React, { useEffect, useState } from 'react'
import { Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, } from "@nextui-org/react";
import Butoon from '../../components/ui/Butoon'
import Heading from '../../components/ui/Heading'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SetLoader } from "../../redux/loadersSlice";
import DataTableModel from '../../components/DateTableForModel/DataTableModel';
import { CreateAttribute, DeleteAttribute, GetAttributeData, UpdateAttribute } from '../../apicalls/attributes';

const Attributes = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [AttributeName, SetAttributeName] = useState("")
    const [updateAttributeId, setUpdateAttributeId] = useState(null)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [attributeData, setAttributeData] = useState([]);

    const getAttributeData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetAttributeData();
            dispatch(SetLoader(false));
            if (response.success) {
                setAttributeData(response.attribute);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            toast.error(error.message)
        }
    }


    useEffect(() => {
        getAttributeData();
    }, [setAttributeData]);


    console.log(attributeData)

    const columns = [
        { name: "ID", uid: "id", sortable: true },
        { name: "NAME", uid: "name", },
        { name: "DATE", uid: "date" },
        { name: "ACTIONS", uid: "actions" },
    ];


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Use the 'formValues' object as needed, for example, send it to an API or perform other actions
        try {
            dispatch(SetLoader(true));
            const response = await CreateAttribute({ name: AttributeName });
            dispatch(SetLoader(false));
            if (response.success) {
                toast.success(response.message)
                setAttributeData(prevData => [...prevData, { _id: response.attributeDoc._id, name: response.attributeDoc.name, createdAt: response.attributeDoc.createdAt, actions: "" }]);
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
    // Update attribute function
    const handleDelete = async (attributeId) => {
        try {
            dispatch(SetLoader(true));
            const response = await DeleteAttribute(attributeId);
            dispatch(SetLoader(false));
            if (response.success) {
                toast.success(response.message);
                // Update attributeData to trigger useEffect
                setAttributeData(prevData => prevData.filter(attribute => attribute._id !== attributeId));
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
            const response = await GetAttributeData(); // Fetch the latest attribute data
            if (response.success) {
                const existingAttribute = response.attribute.find((attri) => attri._id === categoryId);
                if (!existingAttribute) {
                    throw new Error("Attribute not found");
                }

                // Open the modal for updating
                onOpen();
                console.log(existingAttribute.name)
                // Set the category name in the state for editing
                SetAttributeName(existingAttribute.name);


                // Save the category ID for the update function
                setUpdateAttributeId(categoryId);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Error updating Attribute:", error.message);
        }
    };

    // Handle update form submission
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        try {
            dispatch(SetLoader(true));

            // Call the update API with the updated data
            const response = await UpdateAttribute(updateAttributeId, {
                name: AttributeName,
            });

            dispatch(SetLoader(false));

            if (response.success) {
                toast.success(response.message);
                // Update attributeData to trigger useEffect
                setAttributeData((prevData) =>
                    prevData.map((attribute) =>
                        attribute._id === updateAttributeId
                            ? { ...attribute, name: AttributeName }
                            : attribute
                    )
                );

                // Close the modal
                onOpenChange(false);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            console.error("Error updating Attribute:", error.message);
            toast.error(error.message);
        }
    };


    return (
        <>
            {/* attribute add & update model */}
            <Modal
                isOpen={isOpen}
                placement={"top-center"}
                onOpenChange={onOpenChange}

            >
                <ModalContent
                >
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{updateAttributeId ? "Update Attribute" : "Create Attribute"}</ModalHeader>
                            <ModalBody>
                                <Input size={'sm'}
                                    classNames={{
                                        label: "font-bold font-3",
                                        input: "font-semibold font",
                                    }}

                                    type="text" label="Name"
                                    onChange={(e) => SetAttributeName(e.target.value)}
                                    value={AttributeName}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button onClick={updateAttributeId ? handleUpdateSubmit : handleSubmit} className='bg-[#000] text-[#fff]' onPress={onClose}>
                                    {updateAttributeId ? "Update" : "Create "}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <div className="flex items-center justify-between  border-b mx-4 md:mx-10 pb-3 py-5">
                <div className="flex-1 ">
                    <Heading title={`Attributes (${attributeData ? attributeData.length : 0})`} description="Manage Attributes for Products" />
                </div>
                <Butoon onOpen={onOpen} title={"Add New"} />
            </div >
            {Array.isArray(attributeData) && (
                <DataTableModel data={attributeData} columnss={columns} deleteitem={handleDelete} update={handleUpdate} />
            )}
        </>
    )
}

export default Attributes
