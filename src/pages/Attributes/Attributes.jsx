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
    const [AttributeName, SetAttributeName] = useState("");
    const [AttributeValues, setAttributeValues] = useState([""]); // Array for attribute values
    const [updateAttributeId, setUpdateAttributeId] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [attributeData, setAttributeData] = useState([]);

    const getAttributeData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetAttributeData();
            dispatch(SetLoader(false));
            if (response.success) {
                setAttributeData(response.attributes);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            toast.error(error.message)
        }
    }
    // Add a callback function to reset the state when the modal is closed
    const handleCloseModal = () => {
        SetAttributeName("");
        setAttributeValues([""]);
        setUpdateAttributeId(null);
    };

    useEffect(() => {
        getAttributeData();
    }, []);

    const columns = [
        { name: "ID", uid: "id", sortable: true },
        { name: "NAME", uid: "name", },
        { name: "OPTIONS", uid: "options", },
        { name: "DATE", uid: "date" },
        { name: "ACTIONS", uid: "actions" },
    ];


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(SetLoader(true));
            const response = await CreateAttribute({ name: AttributeName, values: AttributeValues });
            dispatch(SetLoader(false));
            if (response.success) {
                toast.success(response.message)
                setAttributeData(prevData => Array.isArray(prevData) ? [...prevData, { _id: response.attributeDoc._id, name: response.attributeDoc.name, options: response.attributeDoc.options, createdAt: response.attributeDoc.createdAt, actions: "" }] : []);
                SetAttributeName("");
                setAttributeValues([""]); // Reset the state for AttributeValues
            } else {
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

    // Update attribute function
    const handleUpdate = async (attributeId) => {
        try {
            const response = await GetAttributeData(); // Fetch the latest attribute data
            if (response.success) {
                const existingAttribute = response.attributes.find((attr) => attr._id === attributeId);
                if (!existingAttribute) {
                    throw new Error("Attribute not found");
                }

                // Open the modal for updating
                onOpen();

                // Set the attribute name and values in the state for editing
                SetAttributeName(existingAttribute.name);

                // Extract the 'value' property from each option object
                const attributeValues = existingAttribute.options.map(option => option.value);
                setAttributeValues(attributeValues);

                // Save the attribute ID for the update function
                setUpdateAttributeId(attributeId);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Error updating Attribute:", error.message);
        }
    };

    console.log(AttributeValues, "values")
    // Handle update form submission
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        try {
            dispatch(SetLoader(true));

            // Call the update API with the updated data
            const response = await UpdateAttribute(updateAttributeId, { name: AttributeName, values: AttributeValues });

            dispatch(SetLoader(false));

            if (response.success) {
                toast.success(response.message);
                // Update attributeData to trigger useEffect
                setAttributeData((prevData) =>
                    prevData.map((attribute) =>
                        attribute._id === updateAttributeId
                            ? { ...attribute, name: AttributeName, options: attribute.options }
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

    console.log(attributeData, "data")

    return (
        <>
            {/* attribute add & update model */}
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
                                {/* Manage attribute values */}
                                {AttributeValues.map((value, index) => (
                                    <div className='flex flex-row' key={index}>
                                        <Input
                                            type="text"
                                            placeholder="value"
                                            labelPlacement="outside"
                                            classNames={{
                                                label: "font-bold font-3",
                                                input: "font-semibold font",
                                            }}
                                            value={value}
                                            onChange={(e) => {
                                                const newValues = [...AttributeValues];
                                                newValues[index] = e.target.value;
                                                setAttributeValues(newValues);
                                            }}
                                        />
                                        {!index == 0 && <Button
                                            isIconOnly
                                            color="warning"
                                            variant="light"
                                            onClick={() => {
                                                const newValues = [...AttributeValues];
                                                newValues.splice(index, 1);
                                                setAttributeValues(newValues);
                                            }}
                                        >
                                            <svg classname="w-8 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M6 12L18 12" stroke="#000000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </g></svg>

                                        </Button>

                                        }
                                    </div>
                                ))}
                                <Button
                                    isIconOnly
                                    color="warning"
                                    variant="light"
                                    className='mx-auto'
                                    onClick={() => setAttributeValues([...AttributeValues, ""])}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M9 12H15" stroke="#323232" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> <path d="M12 9L12 15" stroke="#323232" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </g></svg>

                                </Button>
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
