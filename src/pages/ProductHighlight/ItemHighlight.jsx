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
import { CreateHighlight, DeleteHighlight, GetHighlightData, UpdateHighlight } from '../../apicalls/highlights';

const ItemHighlight = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [HighlightName, SetHighlightName] = useState("")
    const [updateHighlightId, setUpdateHighlightId] = useState(null)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [highlightsData, setHighlightsData] = useState([])

    const getHighlightsData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetHighlightData();
            dispatch(SetLoader(false));
            if (response.success) {
                setHighlightsData(response.highlight);
                console.log(highlightsData)
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            toast.error(error.message)
        }
    }


    useEffect(() => {
        getHighlightsData();
    }, [setHighlightsData]);

    const isAttributeNameUnique = (name) => {
        const lowerCaseName = name.toLowerCase();
        return !highlightsData.some((attribute) => attribute.name.toLowerCase() === lowerCaseName);
    };


    const columns = [
        { name: "NAME", uid: "name", },
        { name: "Created At", uid: "createdAt" },
        { name: "ACTIONS", uid: "actions" },
    ];

    // Add a callback function to reset the state when the modal is closed
    const handleCloseModal = () => {
        SetHighlightName("");
        setUpdateHighlightId(null);
    };

    // Update category function
    const handleDelete = async (categoryId) => {
        try {
            dispatch(SetLoader(true));
            const response = await DeleteHighlight(categoryId);
            dispatch(SetLoader(false));
            if (response.success) {
                toast.success(response.message);
                // Update categoryData to trigger useEffect
                setHighlightsData(prevData => prevData.filter(category => category._id !== categoryId));
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
            const response = await GetHighlightData(); // Fetch the latest category data
            if (response.success) {
                const existingTag = response.highlight.find((cat) => cat._id === categoryId);
                if (!existingTag) {
                    throw new Error("Category not found");
                }

                // Open the modal for updating
                onOpen();
                console.log(existingTag.name)
                // Set the category name in the state for editing
                SetHighlightName(existingTag.name);


                // Save the category ID for the update function
                setUpdateHighlightId(categoryId);
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
            if (!isAttributeNameUnique(HighlightName)) {
                toast.error("Tag name must be unique.");
                return;
            }
            dispatch(SetLoader(true));

            // Call the update API with the updated data
            const response = await UpdateHighlight(updateHighlightId, {
                name: HighlightName,
            });

            dispatch(SetLoader(false));

            if (response.success) {
                toast.success(response.message);
                // Update categoryData to trigger useEffect
                setHighlightsData((prevData) =>
                    prevData.map((category) =>
                        category._id === updateHighlightId
                            ? { ...category, name: HighlightName }
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
            if (!isAttributeNameUnique(HighlightName)) {
                toast.error("Tag name must be unique.");
                return;
            }
            dispatch(SetLoader(true));
            const response = await CreateHighlight({ name: HighlightName });
            dispatch(SetLoader(false));
            if (response.success) {
                toast.success(response.message)
                setHighlightsData(prevData => [...prevData, { _id: response.highlightDoc._id, name: response.highlightDoc.name, createdAt: response.highlightDoc.createdAt, actions: "" }]);
                navigate("/highlights")
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
                            <ModalHeader className="flex flex-col gap-1">{updateHighlightId ? "Update Highlight" : "Create Highlight"}</ModalHeader>
                            <ModalBody>
                                <Input size={'sm'}
                                    classNames={{
                                        label: "font-bold font-3",
                                        input: "font-semibold font",
                                    }}

                                    type="text" label="Name"
                                    onChange={(e) => SetHighlightName(e.target.value)}
                                    value={HighlightName}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button onClick={updateHighlightId ? handleUpdateSubmit : handleSubmit} className='bg-[#000] text-[#fff]' onPress={onClose}>
                                    {updateHighlightId ? "Update" : "Create "}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <div className="flex items-center justify-between  border-b mx-4 md:mx-10 pb-3 py-5">
                <div className="flex-1 ">
                    <Heading title={`Highlights (${highlightsData.length})`} description="Manage Highlight for your Products Details" />
                </div>
                <Butoon onOpen={onOpen} title={"Add New"} />
            </div >
            {Array.isArray(highlightsData) && (
                <DataTableModel data={highlightsData} setdata={setHighlightsData} columnss={columns} deleteitem={handleDelete} update={handleUpdate} />
            )}
        </>
    )
}

export default ItemHighlight
