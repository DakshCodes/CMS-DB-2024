import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    DragDropContext,
    Draggable,
    Droppable,
} from "react-beautiful-dnd";
import './Sequence.css'
import { Card, CardBody } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import { GetslidercomData } from "../../apicalls/slidercomponent";
import { GetlayoutimgData } from "../../apicalls/layoutimages";
import { getAllCards } from "../../apicalls/card";

const sampleTodos = [
    {
        id: uuidv4(),
        title: "banner-1",
        sortIndex: 0,
    },
    {
        id: uuidv4(),
        title: "banner-2",
        sortIndex: 1,
    },
    {
        id: uuidv4(),
        title: "slide-1",
        sortIndex: 2,
    },
    {
        id: uuidv4(),
        title: "slider-2",
        sortIndex: 3,
    },
    {
        id: uuidv4(),
        title: "card-1",
        sortIndex: 4,
    },
    {
        id: uuidv4(),
        title: "image-1",
        sortIndex: 5,
    },
];

function LayoutSequence() {
  const dispatch = useDispatch();
    const [sliderData, setSliderData] = useState([]);
    const [layoutData, setLayoutData] = useState([]);
    const [cardsData, setCardsData] = useState([]);

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
    const componentsdata = [...sliderData, ...layoutData, ...cardsData];

    const handleDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        // Avoid mutating the state directly
        const tempTodos = [...componentsdata];
        const [movedItem] = tempTodos.splice(source.index, 1);
        movedItem.column = destination.droppableId;
        tempTodos.splice(destination?.index, 0, movedItem);

        // Update the state with the modified data
        componentsdata.length = 0;
        Array.prototype.push.apply(componentsdata, tempTodos.map((todo, index) => ({ ...todo, sortIndex: index })));
    };

    console.log(componentsdata, "Data");

    return (
        <div className="app">
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="container-sort__wrapper">
                    <div className="container-sort__column mx-5">
                        <h5 className="font font-[600] text-[2rem]">Layout Components</h5>
                        <div >
                            <Droppable droppableId="incomplete">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="overflow-y-auto mt-5 h-[40rem] max-w-max  flex flex-col justify-between gap-5">
                                        {componentsdata
                                            .map((todo, index) => (
                                                <div className="flex items-center gap-20" key={todo._id}>
                                                    <h1 className="font-2 font-bold text-[1.5rem]">Sequence {index + 1}</h1>
                                                    <Draggable
                                                        key={todo._id}
                                                        draggableId={todo._id}
                                                        index={index}
                                                    >
                                                        {(provided) => (

                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="p-3 border-2 border-black/30 rounded-xl">
                                                                <Card
                                                                    className="font-2  font-[400] text-[1.5rem] h-[5rem] w-[30rem]  text-[#fff] uppercase flex justify-center items-center bg-gradient-to-r from-gray-700 via-gray-900 to-black "
                                                                >
                                                                    <CardBody className="flex justify-between flex-row items-center">
                                                                        <svg viewBox="0 0 48 48" height={30} xmlns="http://www.w3.org/2000/svg" fill="#fff" stroke="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>drag-arrow-solid</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="icons_Q2" data-name="icons Q2"> <path d="M45.4,22.6l-5.9-6a2.1,2.1,0,0,0-2.7-.2,1.9,1.9,0,0,0-.2,3L39.2,22H26V8.8l2.6,2.6a1.9,1.9,0,0,0,3-.2,2.1,2.1,0,0,0-.2-2.7l-6-5.9a1.9,1.9,0,0,0-2.8,0l-6,5.9a2.1,2.1,0,0,0-.2,2.7,1.9,1.9,0,0,0,3,.2L22,8.8V22H8.8l2.6-2.6a1.9,1.9,0,0,0-.2-3,2.1,2.1,0,0,0-2.7.2l-5.9,6a1.9,1.9,0,0,0,0,2.8l5.9,6a2.1,2.1,0,0,0,2.7.2,1.9,1.9,0,0,0,.2-3L8.8,26H22V39.2l-2.6-2.6a1.9,1.9,0,0,0-3,.2,2.1,2.1,0,0,0,.2,2.7l6,5.9a1.9,1.9,0,0,0,2.8,0l6-5.9a2.1,2.1,0,0,0,.2-2.7,1.9,1.9,0,0,0-3-.2L26,39.2V26H39.2l-2.6,2.6a1.9,1.9,0,0,0,.2,3,2.1,2.1,0,0,0,2.7-.2l5.9-6A1.9,1.9,0,0,0,45.4,22.6Z"></path> </g> </g> </g></svg>
                                                                        <p>{todo?.heading && "Slider->" + todo?.heading || todo?.mainHeading && "Cards->" + todo?.mainHeading || todo?.name && "Layout->" + todo?.name}</p>
                                                                    </CardBody>
                                                                </Card>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                </div>
                                            ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
}

export default LayoutSequence;