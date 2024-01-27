import React, { useEffect, useState } from 'react'
import Heading from '../../components/ui/Heading'
import Butoon from '../../components/ui/Butoon'
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch, Tooltip, useDisclosure } from '@nextui-org/react';
import DataTableModel from '../../components/DateTableForModel/DataTableModel';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { GetProductsData } from '../../apicalls/product';
import { SetLoader } from '../../redux/loadersSlice';
import { createCard, deleteCardById, getAllCards, updateCardById } from '../../apicalls/card';

const CardComponent = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [visibility, setVisibility] = useState(true);
    const [productsData, setProductsData] = useState([]);
    const [components, setComponents] = useState(Array.from({ length: 5 }, () => ({ selectedProduct: '', isVisible: true }))); // New state to manage selected components
    const [mainTitle, setMainTitle] = useState('')
    const [cardsData, setCardsData] = useState('')
    const [cardId, setCardId] = useState('')



    const dispatch = useDispatch();

    const columns = [
        { name: "Main Title", uid: "mainHeading", },
        { name: "Visibility", uid: "isVisible" },
        { name: "No. of Items ", uid: "productsData.length" },
        { name: "Created At", uid: "createdAt" },
        { name: "ACTIONS", uid: "actions" },
    ];


    const getProductData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetProductsData();
            dispatch(SetLoader(false));
            console.log(response)
            if (response.success) {
                setProductsData(response.products);
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getProductData();
    }, [])

    // const handleDelete = async (bannerID) => {
    //     try {
    //         dispatch(SetLoader(true));
    //         const response = await DeleteBannerById(bannerID);
    //         dispatch(SetLoader(false));
    //         console.log(response);
    //         if (response.success) {
    //             toast.success(response.message);
    //             // setBannerData(response.bannerData)
    //             getBannerData();
    //         } else {
    //             throw new Error(response.error || response.message);
    //         }
    //     } catch (error) {
    //         dispatch(SetLoader(false));
    //         console.log(error);
    //         toast.error(error || error.message);
    //     }
    // };

    const handleUpdateSubmit = async () => {
        try {
            // Retrieve the existing card data
            const existingCard = cardsData.find((card) => card._id === cardId);
            if (!existingCard) {
                throw new Error("Card not found");
            }

            // Check if there are any changes in mainTitle, visibility, or productsData
            const isMainTitleChanged = mainTitle !== existingCard.mainHeading;
            const isVisibilityChanged = visibility !== existingCard.isVisible;
            const isProductsDataChanged = !compareArrays(components, existingCard.productsData);

            // If nothing is changed, no need for API call
            if (!isMainTitleChanged && !isVisibilityChanged && !isProductsDataChanged) {
                toast.success("No changes detected.");
                onOpenChange(false);
                return;
            }

            const payload = {
                mainHeading: mainTitle,
                isVisible: visibility,
                productsData: components.map((component) => ({
                    unitProduct: component.selectedProduct,
                    isVisible: component.isVisible,
                })),
            };

            dispatch(SetLoader(true));
            const response = await updateCardById(cardId, payload);
            dispatch(SetLoader(false));

            if (response.success) {
                toast.success(response.message);
                getCardsData();
                onOpenChange(false);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            console.error("Error updating Card:", error.message);
            toast.error(error.message);
        }
    };

    // Utility function to compare arrays of objects
    const compareArrays = (array1, array2) => {
        const sortedArray1 = array1.slice().sort();
        const sortedArray2 = array2.slice().sort();
        return JSON.stringify(sortedArray1) === JSON.stringify(sortedArray2);
    };



    const getCardsData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await getAllCards();
            dispatch(SetLoader(false));
            console.log(response)
            if (response.success) {
                setCardsData(response.cards);
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getCardsData();
    }, [])

    const handleAddComponent = () => {
        setComponents((prevComponents) => [...prevComponents, { selectedProduct: '', isVisible: true }]);
    };

    const handleRemoveComponent = (index) => {
        setComponents(prev => prev.filter((_, i) => i !== index));
    };

    const handleSelectChange = (index, value) => {
        setComponents(prev => {
            const updatedComponents = [...prev];
            updatedComponents[index].selectedProduct = value;
            return updatedComponents;
        });
    };

    const handleCloseModal = () => {
        setComponents(Array.from({ length: 5 }, () => ({ selectedProduct: '', isVisible: true })))
        setMainTitle('')
        setCardId(null)
    };

    const handleToggleChange = (index) => {
        setComponents(prev => {
            const updatedComponents = [...prev];
            updatedComponents[index].isVisible = !updatedComponents[index].isVisible;
            return updatedComponents;
        });
    };

    const handleUpdate = async (categoryId) => {
        try {
            const response = await getAllCards();
            if (response.success) {
                const existingCard = response.cards.find((cat) => cat._id === categoryId);
                if (!existingCard) {
                    throw new Error("Slider not found");
                }

                onOpen();
                setCardId(existingCard._id)

                setMainTitle(existingCard.mainHeading);
                setVisibility(existingCard.isVisible);


                // Map existingCard.productsData to components state
                const updatedComponents = existingCard?.productsData?.map((productData) => ({
                    selectedProduct: productData.unitProduct,
                    isVisible: productData.isVisible,
                }));
                console.log(updatedComponents)
                setComponents(updatedComponents);

            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Error updating Slider:", error.message);
        }
    };


    const handleDelete = async (cardId) => {
        try {
            dispatch(SetLoader(true));
            const response = await deleteCardById(cardId);
            dispatch(SetLoader(false));
            if (response.success) {
                toast.success(response.message);
                getCardsData();
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            console.log(error.message);
            toast.error(error.message);
        }
    };

    const handleSubmit = async () => {
        try {
            // Check if mainTitle, visibility, and at least one component is present
            if (!mainTitle || components.length === 0) {
                throw new Error('Please fill in all required fields.');
            }

            // Check if each component has a selected product
            const hasEmptyProduct = components.some(component => !component.selectedProduct);
            if (hasEmptyProduct) {
                throw new Error('Please select a product for each component.');
            }

            const payload = {
                mainHeading: mainTitle, // Add your main title
                isVisible: visibility,
                productsData: components.map((component) => ({
                    unitProduct: component.selectedProduct,
                    isVisible: component.isVisible,
                })),
            };
            console.log(payload)


            dispatch(SetLoader(true));
            const response = await createCard(payload);
            console.log(response)
            dispatch(SetLoader(false));

            if (response.success) {
                toast.success(response.message);
                getCardsData();
                onOpenChange(false);
            } else {
                throw new Error("Somethig Went wrong , Please Try again");
            }
        } catch (error) {
            dispatch(SetLoader(false));
            console.error("Error creating card:", error.message);
            toast.error(error.message);
        }
    };

    return (
        <>

            {/* category add model */}
            <Modal
                isOpen={isOpen}
                placement={"top-center"}
                size='2xl'
                className='h-[30rem] overflow-scroll'
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
                            <ModalHeader className="flex flex-col gap-1" >{cardId ? "Update" : "Add"} Card Component</ModalHeader>
                            <ModalBody>
                                <Input size={'sm'}
                                    classNames={{
                                        label: "font-bold font-3",
                                        input: "font-semibold font",
                                    }}

                                    type="text" label="Main Title"
                                    onChange={(e) => setMainTitle(e.target.value)}
                                    value={mainTitle}
                                />
                                <div className="mb-4 border-black mt-6 gap-4 flex items-center">
                                    <div className='text-xl font-semibold'>Visibility</div>
                                    <Tooltip showArrow={true} color='secondary' placement="bottom-start" content="Do you want to make this card component visible in main website ? ">
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


                                <div>
                                    <div className='my-4 flex gap-2 items-center'>Select the as many copmonents as you want (min. 5)
                                        <div className='font-semibold border-2 border-black px-2 cursor-pointer w-fit' onClick={handleAddComponent}>Add new</div>
                                    </div>
                                    {components.map((component, index) => (
                                        <div className='flex items-center gap-4 mt-4' key={index}>
                                            <select
                                                className='border-2 h-fit border-gray-300 w-full p-2'
                                                value={component.selectedProduct}
                                                onChange={(e) => handleSelectChange(index, e.target.value)}
                                            >
                                                <option value="">Select Product</option>
                                                {productsData.map((item, productIndex) => (
                                                    <option key={productIndex} value={item._id}>
                                                        {item.productName}
                                                    </option>
                                                ))}
                                            </select>

                                            <div className="mb-4 border-black mt-6 gap-4 flex items-center">
                                                <Tooltip showArrow={true} color='secondary' placement="bottom-start" content="Do you want to make this card component visible in the main website?">
                                                    <svg className="w-6 h-6 hover:cursor-pointer text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                                    </svg>
                                                </Tooltip>
                                                <Switch
                                                    defaultSelected={component.isVisible}
                                                    size="sm"
                                                    color='primary'
                                                    onChange={() => handleToggleChange(index)}
                                                >
                                                    {component.isVisible ? 'Visible' : 'Not Visible'}
                                                </Switch>

                                                <div className='border border-black text-3xl px-2 cursor-pointer' onClick={() => handleRemoveComponent(index)}>-</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button className='bg-[#000] text-[#fff]' onPress={cardId ? handleUpdateSubmit : handleSubmit}>
                                    {cardId ? "Save Changes" : "Create"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <div className="flex items-center justify-between  border-b mx-4 md:mx-10 pb-3 py-5">
                <div className="flex-1 ">
                    <Heading title={`Cards (${cardsData.length})`} description="Manage Cards for your landing page" />
                </div>
                <Butoon onOpen={onOpen} title={"Add New"} />
            </div >

            {Array.isArray(cardsData) && (
                <DataTableModel data={cardsData} setdata={setCardsData} columnss={columns} deleteitem={handleDelete} update={handleUpdate} />
            )}




        </>
    )
}

export default CardComponent
