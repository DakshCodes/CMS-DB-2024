import React, { useEffect, useState } from 'react'
import { Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, SelectItem, Select, } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

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
    const [updateAttributeId, setUpdateAttributeId] = useState(null);
    const [currentValue, setCurrentValue] = useState("");
    const [attributeValuesTable, setAttributeValuesTable] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [attributeData, setAttributeData] = useState([]);

    const handleAddValue = () => {
        if (currentValue.trim() !== "") {
            setAttributeValuesTable((prevValues) => [...prevValues, currentValue.trim()]);
            setCurrentValue("");
        }
    };

    const handleDeleteValue = (index) => {
        const updatedValues = [...attributeValuesTable];
        updatedValues.splice(index, 1);
        setAttributeValuesTable(updatedValues);
    };

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
            toast.error(error.message);
        }
    };

    const handleCloseModal = () => {
        SetAttributeName("");
        setAttributeValuesTable([]);
        setUpdateAttributeId(null);
    };

    useEffect(() => {
        getAttributeData();
    }, []);

    const columns = [
        { name: "ID", uid: "id", sortable: true },
        { name: "NAME", uid: "name" },
        { name: "OPTIONS", uid: "options" },
        { name: "DATE", uid: "date" },
        { name: "ACTIONS", uid: "actions" },
    ];

    const isAttributeNameUnique = (name) => {
        const lowerCaseName = name.toLowerCase();
        return !attributeData.some((attribute) => attribute.name.toLowerCase() === lowerCaseName);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // if (!isAttributeNameUnique(AttributeName)) {
            //     toast.error("Attribute name must be unique.");
            //     return;
            // }

            dispatch(SetLoader(true));
            const response = await CreateAttribute({ name: AttributeName, values: attributeValuesTable });
            dispatch(SetLoader(false));

            if (response.success) {
                toast.success(response.message);
                setAttributeData((prevData) => [
                    ...prevData,
                    {
                        _id: response.attributeDoc._id,
                        name: response.attributeDoc.name,
                        options: response.attributeDoc.options,
                        createdAt: response.attributeDoc.createdAt,
                        actions: "",
                    },
                ]);
                SetAttributeName("");
                setAttributeValuesTable([]);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            console.error(error.message);
            toast.error(error.message);
        }
    };

    const handleDelete = async (attributeId) => {
        try {
            dispatch(SetLoader(true));
            const response = await DeleteAttribute(attributeId);
            dispatch(SetLoader(false));
            if (response.success) {
                toast.success(response.message);
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

    const handleUpdate = async (attributeId) => {
        try {
            const response = await GetAttributeData();
            if (response.success) {
                const existingAttribute = response.attributes.find((attr) => attr._id === attributeId);
                if (!existingAttribute) {
                    throw new Error("Attribute not found");
                }

                onOpen();
                SetAttributeName(existingAttribute.name);

                const attributeValues = existingAttribute.options.map(option => option.value);
                setAttributeValuesTable(attributeValues);

                setUpdateAttributeId(attributeId);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Error updating Attribute:", error.message);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        try {
            // if (!isAttributeNameUnique(AttributeName)) {
            //     toast.error("Attribute name must be unique.");
            //     return;
            // }
            dispatch(SetLoader(true));

            const response = await UpdateAttribute(updateAttributeId, { name: AttributeName, values: attributeValuesTable });
            dispatch(SetLoader(false));

            if (response.success) {
                toast.success(response.message);
                setAttributeData((prevData) =>
                    prevData.map((attribute) =>
                        attribute._id === updateAttributeId
                            ? { ...attribute, name: AttributeName, options: attribute.options }
                            : attribute
                    )
                );

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
                                    disabled={AttributeName == "Colors"}
                                    type="text"
                                    label={AttributeName == "Colors" ? ("You Can't Change The Name Add Values Only") : "Name"}
                                    onChange={(e) => SetAttributeName(e.target.value)}
                                    value={AttributeName}
                                />
                                {/* Manage attribute values */}
                                <div className="flex flex-row">
                                    <Input
                                        type="text"
                                        placeholder="Value"
                                        labelPlacement="outside"
                                        classNames={{
                                            label: "font-bold font-3",
                                            input: "font-semibold font",
                                        }}
                                        value={currentValue}
                                        onChange={(e) => setCurrentValue(e.target.value)}
                                    />
                                    <Button isIconOnly color="warning" variant="light" onClick={handleAddValue}>
                                        <svg className="w-8 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                            <g id="SVGRepo_iconCarrier">
                                                <path d="M9 12H15" stroke="#323232" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M12 9L12 15" stroke="#323232" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                            </g>
                                        </svg>
                                    </Button>
                                </div>
                                <Table
                                    classNames={{
                                        base: "max-h-[120px] overflow-scroll",
                                        table: "min-h-[70px]",
                                        th: "text-center",
                                        tr: "text-center",
                                        td: "font-sans font-bold"

                                    }}
                                    aria-label="Attribute Values Table"
                                >
                                    <TableHeader>
                                        <TableColumn>VALUE</TableColumn>
                                        <TableColumn>ACTION</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {attributeValuesTable.map((value, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{value}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className="text-lg text-danger cursor-pointer active:opacity-50 flex justify-center items-center"
                                                        onClick={() => handleDeleteValue(index)}
                                                    >
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
