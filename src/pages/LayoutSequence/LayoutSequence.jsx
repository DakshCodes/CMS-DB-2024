import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    DragDropContext,
    Draggable,
    Droppable,
} from "react-beautiful-dnd";
import './Sequence.css'
import { Button, Card, CardBody, Chip, Listbox, ListboxItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ScrollShadow, useDisclosure } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import { GetslidercomData } from "../../apicalls/slidercomponent";
import { GetlayoutimgData } from "../../apicalls/layoutimages";
import { getAllCards } from "../../apicalls/card";
import { Createfrontlayout, GetfrontlayoutData, Updatefrontlayout } from "../../apicalls/frontlayout";
import toast from "react-hot-toast";
import { GetmultitabsData } from "../../apicalls/multipletabs";


function LayoutSequence() {
    const dispatch = useDispatch();
    const [sliderData, setSliderData] = useState([]);
    const [layoutData, setLayoutData] = useState([]);
    const [cardsData, setCardsData] = useState([]);
    const [TabsData, setTabsData] = useState([]);
    const [LayoutSequence, setLayoutSequence] = useState([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));


    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(SetLoader(true));

                const sliderResponse = await GetslidercomData();
                if (sliderResponse.success) {
                    setSliderData(sliderResponse.slidercom);
                } else {
                    throw new Error(sliderResponse.message);
                }

                const layoutResponse = await GetlayoutimgData();
                if (layoutResponse.success) {
                    setLayoutData(layoutResponse.layoutimg);
                } else {
                    throw new Error(layoutResponse.message);
                }

                const cardsResponse = await getAllCards();
                if (cardsResponse.success) {
                    setCardsData(cardsResponse.cards);
                } else {
                    throw new Error(cardsResponse.error);
                }
                const multitabsres = await GetmultitabsData();
                if (multitabsres.success) {
                    setCardsData(multitabsres.multitabs);
                } else {
                    throw new Error(multitabsres.error);
                }

                const frontLayoutResponse = await GetfrontlayoutData();
                if (frontLayoutResponse.success) {
                    // Update the state with front layout data

                    console.log(frontLayoutResponse.frontlayout[0], "res")
                    const frontLayoutData = frontLayoutResponse.frontlayout[0];
                    if (frontLayoutData?.Layout?.length > 0) {
                        setSelectedKeys(new Set(frontLayoutData.Layout.map(item => item.id)));
                        setLayoutSequence(frontLayoutData); // You may need to adjust this based on your backend response structure
                    }
                } else {
                    throw new Error(frontLayoutResponse.message);
                }

                dispatch(SetLoader(false));
            } catch (error) {
                dispatch(SetLoader(false));
                console.error("Error fetching data:", error);
                toast.error(error.message);
            }
        };

        fetchData();
    }, [dispatch]);

    // Combine all data when needed
    const componentsdata = [...sliderData, ...layoutData, ...cardsData, ...TabsData];



    const selectedValuesArray = React.useMemo(
        () => Array.from(selectedKeys).map((id) => {
            const foundComponent = componentsdata.find((component) => component._id === id);
            return { id, name: foundComponent?.heading && foundComponent?.heading || foundComponent?.mainHeading && foundComponent?.mainHeading || foundComponent?.name && foundComponent?.name };
        }),
        [selectedKeys]
    );

    const handleDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        // Avoid mutating the state directly
        const tempTodos = [...selectedValuesArray];
        const [movedItem] = tempTodos.splice(source.index, 1);
        movedItem.column = destination.droppableId;
        tempTodos.splice(destination?.index, 0, movedItem);

        // Update the state with the modified data
        selectedValuesArray.length = 0;
        Array.prototype.push.apply(selectedValuesArray, tempTodos.map((todo, index) => ({ ...todo, sortIndex: index })));
    };


    const SubmitLayout = async (e) => {
        e.preventDefault();
        try {
            dispatch(SetLoader(true));

            // Check if LayoutSequence has data
            if (LayoutSequence && LayoutSequence._id) {
                // If data exists, update the existing layout
                const response = await Updatefrontlayout(LayoutSequence._id, selectedValuesArray);
                if (response.success) {
                    toast.success(response.message);
                    console.log(response.frontlayoutDoc, "Updated data");
                } else {
                    throw new Error(response.message);
                }
            } else {
                // If no data exists, create a new layout
                const response = await Createfrontlayout(selectedValuesArray);
                if (response.success) {
                    toast.success(response.message);
                    console.log(response.frontlayoutDoc, "Created data");
                } else {
                    throw new Error(response.message);
                }
            }

            dispatch(SetLoader(false));
        } catch (error) {
            dispatch(SetLoader(false));
            console.error(error.message);
            toast.error(error.message);
        }
    }


    console.log(selectedValuesArray, "Data");


    return (
        <div className="app">
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                scrollBehavior={"inside"}
                shadow="md"
                backdrop="opaque"
                size="lg"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Select Components
                            </ModalHeader>
                            <ModalBody>
                                <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100" >
                                    <Listbox
                                        aria-label="Multiple selection example"
                                        variant="flat"
                                        disallowEmptySelection
                                        selectionMode="multiple"
                                        selectedKeys={selectedKeys}
                                        onSelectionChange={setSelectedKeys}
                                        items={componentsdata}
                                    >
                                        {(item) => (
                                            <ListboxItem
                                                classNames={{
                                                    title: "font-sans text-[0.9rem] font-[400]"
                                                }}
                                                key={item._id} textValue={item?.heading && "Slider->" + item?.heading || item?.mainHeading && "Cards->" + item?.mainHeading || item?.name && "Layout->" + item?.name}>{item?.heading && "Slider->" + item?.heading || item?.mainHeading && "Cards->" + item?.mainHeading || item?.name && "Layout->" + item?.name}</ListboxItem>
                                        )}
                                    </Listbox>
                                </div >
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="container-sort__wrapper">
                    <div className="container-sort__column  my-3 ">
                        <div className="flex justify-around items-center">
                            <h5 className="font font-[600] text-[2rem]">Layout Components</h5>
                            <Button onPress={onOpen} color="secondary" className="font-sans font-[600]">Add Components</Button>
                        </div>
                        <div className="bg-[#000] max-w-[90rem] max-h-[38rem] rounded-xl  mx-auto overflow-scroll mt-5" >
                            <Droppable droppableId="layout">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="overflow-y-auto   relative border  flex flex-col justify-between gap-5">
                                        {
                                            !(selectedValuesArray?.length > 0) ? (<div className="text-[#fff] font font-bold text-[2rem] uppercase m-auto mx-40">No Components Here ? </div>) : (
                                                selectedValuesArray
                                                    ?.map((todo, index) => (
                                                        <div className="flex items-center gap-16 mx-4" key={todo.id}>
                                                            <h1 className="font-2 font-bold text-[#fff] text-[1.5rem]">Sequence {index + 1}</h1>
                                                            <Draggable
                                                                key={todo.id}
                                                                draggableId={todo.id}
                                                                index={index}
                                                            >
                                                                {(provided) => (

                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className="p-3 border-2 border-black/30 rounded-xl">
                                                                        <Card
                                                                            className="font-2  font-[400] text-[1.5rem] h-[4rem] w-[30rem]  text-[#000] uppercase flex justify-center items-center bg-gradient-to-r from-gray-600 via-gray-500 to-[#fff] "
                                                                        >
                                                                            <CardBody className="flex justify-between flex-row items-center">
                                                                                <svg viewBox="0 0 48 48" height={30} xmlns="http://www.w3.org/2000/svg" fill="#fff" stroke="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>drag-arrow-solid</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="icons_Q2" data-name="icons Q2"> <path d="M45.4,22.6l-5.9-6a2.1,2.1,0,0,0-2.7-.2,1.9,1.9,0,0,0-.2,3L39.2,22H26V8.8l2.6,2.6a1.9,1.9,0,0,0,3-.2,2.1,2.1,0,0,0-.2-2.7l-6-5.9a1.9,1.9,0,0,0-2.8,0l-6,5.9a2.1,2.1,0,0,0-.2,2.7,1.9,1.9,0,0,0,3,.2L22,8.8V22H8.8l2.6-2.6a1.9,1.9,0,0,0-.2-3,2.1,2.1,0,0,0-2.7.2l-5.9,6a1.9,1.9,0,0,0,0,2.8l5.9,6a2.1,2.1,0,0,0,2.7.2,1.9,1.9,0,0,0,.2-3L8.8,26H22V39.2l-2.6-2.6a1.9,1.9,0,0,0-3,.2,2.1,2.1,0,0,0,.2,2.7l6,5.9a1.9,1.9,0,0,0,2.8,0l6-5.9a2.1,2.1,0,0,0,.2-2.7,1.9,1.9,0,0,0-3-.2L26,39.2V26H39.2l-2.6,2.6a1.9,1.9,0,0,0,.2,3,2.1,2.1,0,0,0,2.7-.2l5.9-6A1.9,1.9,0,0,0,45.4,22.6Z"></path> </g> </g> </g></svg>
                                                                                <p>{todo?.name}</p>
                                                                            </CardBody>
                                                                        </Card>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        </div>
                                                    ))
                                            )
                                        }
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                        <Button color="danger" onClick={SubmitLayout} className="mt-10" >
                            Save Layout
                        </Button>
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
}

export default LayoutSequence;