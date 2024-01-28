import React, { useEffect, useRef, useState } from 'react'
import { Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Card, Checkbox, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import Butoon from '../../components/ui/Butoon'
import Heading from '../../components/ui/Heading'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SetLoader } from "../../redux/loadersSlice";
import DataTableModel from '../../components/DateTableForModel/DataTableModel';
import { GetmultitabsData,Createmultitabs,Updatemultitabs,Deletemultitabs} from '../../apicalls/multipletabs';
import { UploadImage } from '../../apicalls/user';
import { GetProductsData } from '../../apicalls/product';
import { GetslidercomData } from '../../apicalls/slidercomponent';

const Multipletabs = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const fileInputRef = useRef(null)
    const dispatch = useDispatch();
    const [TabsData, setTabsData] = useState([]);
    const [loading, setloading] = useState(false);
    const [layoutid, setlayoutid] = useState("");
    const [selectedImage, setSelectedImage] = useState('');
    const [isSelected, setIsSelected] = useState(false);
    const [sliderData, setSliderData] = useState([]);
    const [cardselected, setCardSelected] = useState(false);
    const [refcomponent, setrefcomponent] = useState("");
    const [tabname, settabname] = useState("");


    const getSliderData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetslidercomData();
            dispatch(SetLoader(false));
            if (response.success) {
                setSliderData(response.slidercom);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            toast.error(error.message)
        }
    }


    const [layout, setLayout] = useState({
        name: "",
        Tabs: [],
        visible: false
    });

    const columns = [
        { name: "NAME", uid: "name", },
        { name: "Created At", uid: "createdAt" },
        { name: "ACTIONS", uid: "actions" },
    ];

    const getLayoutData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetmultitabsData();
            dispatch(SetLoader(false));
            if (response.success) {
                setTabsData(response.multitabs);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getLayoutData();
        getSliderData();
    }, []);

    const isAttributeNameUnique = (name) => {
        const lowerCaseName = tabname.toLowerCase();
        return !TabsData?.some((attribute) => attribute?.name?.toLowerCase() === lowerCaseName);
    };

    const handleCloseModal = () => {
        setSelectedImage("");
        setLayout(null)
        setIsSelected(false)
        setCardSelected(false)
    };

    const handleDelete = async (categoryId) => {
        try {
            dispatch(SetLoader(true));
            const response = await Deletemultitabs(categoryId);
            dispatch(SetLoader(false));
            if (response.success) {
                toast.success(response.message);
                setTabsData(prevData => prevData.filter(category => category._id !== categoryId));
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            console.log(error.message);
            toast.error(error.message);
        }
    };

    const handleUpdate = async (categoryId) => {
        try {
            const response = await GetmultitabsData();
            if (response.success) {
                const existingTag = response.multitabs.find((cat) => cat._id === categoryId);
                if (!existingTag) {
                    throw new Error("Tab not found");
                }

                onOpen();
                console.log(existingTag,"exist")
                setLayout({ ...layout, name: existingTag.name, Tabs: existingTag.Tabs, visible: existingTag.visible });
                setIsSelected(existingTag?.visible)
                setlayoutid(categoryId)
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Error updating category:", error.message);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            // if (!isAttributeNameUnique(layout.name)) {
            //     toast.error("Tag name must be unique.");
            //     return;
            // }
            layout.visible = isSelected;

            dispatch(SetLoader(true));
            const response = await Updatemultitabs(layoutid, layout);

            dispatch(SetLoader(false));

            if (response.success) {
                toast.success(response.message);
                setTabsData((prevData) =>
                    prevData?.map((category) =>
                        category._id === layoutid
                            ? { ...category, name: layout.name, Images: layout.Images, visible: layout.visible }
                            : category
                    )
                );
                onOpenChange(false);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            console.error("Error updating Layout:", error.message);
            toast.error(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!isAttributeNameUnique(layout.name)) {
                toast.error("Layput name must be unique.");
                return;
            }

            layout.visible = isSelected;
            dispatch(SetLoader(true));
            const response = await Createmultitabs(layout);

            dispatch(SetLoader(false));

            if (response.success) {
                toast.success(response.message)
                setTabsData(prevData => [...prevData, { _id: response.multitabsDoc._id, name: response.multitabsDoc.name, Tabs: response.multitabsDoc.Tabs, createdAt: response.multitabsDoc.createdAt, visible: response.multitabsDoc.visible, actions: "" }]);
                setLayout({});
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            console.log(error.message)
            toast.error(error.message)
        }
    };

    const handleAddValue = (e) => {
        if (!tabname) {
            toast.error("Tab name Required.");
            return;
        }
        if (!refcomponent) {
            toast.error("Component Ref Required.");
            return;
        }

        if (layout && Array.isArray(layout?.Tabs)) {
            setLayout({ ...layout, Tabs: [...layout?.Tabs, { tabname: tabname, component: refcomponent, active: cardselected }] });
        } else {
            toast.error("layout is undefined or layout.Tabs is not an array:", layout);
        }
        settabname("")
        setrefcomponent("")
        cardselected(false)
    };
    const handleDeleteValue = (index) => {
        // Create a copy of the Images array
        const UpadatedTabs = [...layout?.Tabs];
        // Remove the image at the specified index
        UpadatedTabs.splice(index, 1);
        // Update the state with the modified Images array
        setLayout({ ...layout, Tabs: UpadatedTabs });
    };


    console.log(layout, "layout")

    return (
        <div className='w-full h-full flex justify-between flex-col'>
            <Modal
                isOpen={isOpen}
                placement={"top-center"}
                onOpenChange={(newState) => {
                    onOpenChange(newState);
                    if (!newState) {
                        handleCloseModal();
                    }
                }}
                size="2xl"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-2xl font-bold font-sans  mb-3">{layoutid ? "Update Tabs" : "Create Tabs"}</ModalHeader>

                            <ModalBody className='flex flex-col gap-6'>
                                <div>
                                    <Input size={'md'}
                                        classNames={{
                                            label: "font-[600] font-3",
                                            input: "font-[600] font-sans",
                                        }}
                                        labelPlacement="outside"
                                        type="text" label="Component Title"
                                        placeholder='Latest-Tabs'
                                        onChange={(e) => setLayout({ ...layout, name: e.target.value })}
                                        value={layout?.name}
                                        variant="flat"
                                    />
                                    <Checkbox className='mt-3 mx-2 font-sans font-[600]' color='primary' isSelected={isSelected} onValueChange={setIsSelected}>
                                        Visible
                                    </Checkbox>
                                </div>
                                <div className="img-form flex flex-col gap-5">
                                    <h1 className='font font-[600]'>Add Tabs (maximum 3)</h1>
                                    <div className='flex gap-5 justify-start gap-5' >
                                        <div className="flex flex-row items-center justify-between  w-full">
                                            <Input
                                                isDisabled={layout?.Tabs?.length >= 3}
                                                type="text"
                                                placeholder="Tab Name"
                                                labelPlacement="outside"
                                                className='max-w-[13rem]'
                                                classNames={{
                                                    label: "font-bold font-3",
                                                    input: "font-semibold font ",
                                                }}
                                                value={tabname}
                                                onChange={(e) => settabname(e.target.value)}
                                            />
                                            <Select
                                                isDisabled={layout?.Tabs?.length >= 3}
                                                placeholder="Select Component"
                                                className="max-w-[12rem] font-[800] font-sans"
                                                size='sm'
                                                variant='flat'
                                                onChange={(e) => setrefcomponent(e.target.value)}
                                                disableSelectorIconRotation
                                                selectorIcon={
                                                    <svg
                                                        aria-hidden="true"
                                                        fill="none"
                                                        focusable="false"
                                                        height="1em"
                                                        role="presentation"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.5"
                                                        viewBox="0 0 24 24"
                                                        width="1em"
                                                    >
                                                        <path d="M0 0h24v24H0z" fill="none" stroke="none" />
                                                        <path d="M8 9l4 -4l4 4" />
                                                        <path d="M16 15l-4 4l-4 -4" />
                                                    </svg>
                                                }
                                            >
                                                {sliderData?.map((animal) => (
                                                    <SelectItem className='font-[900] font-sans' key={animal?._id} value={animal?.heading}>
                                                        {animal?.heading}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                            <Checkbox isDisabled={layout?.Tabs?.length >= 3} className='font-sans font-[600]' color='primary' isSelected={cardselected} onValueChange={setCardSelected}>
                                                Active
                                            </Checkbox>
                                            <Button isIconOnly color="warning" variant="light"
                                                onClick={handleAddValue}
                                                isDisabled={layout?.Tabs?.length >= 3}
                                            >
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
                                    </div>
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
                                        <TableColumn>NAME</TableColumn>
                                        <TableColumn>Active</TableColumn>
                                        <TableColumn>Ref</TableColumn>
                                        <TableColumn>ACTION</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {layout?.Tabs?.map((value, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{value.tabname}</TableCell>
                                                <TableCell>{value.active ? "Active" : "Inactive"}</TableCell>
                                                <TableCell>{value.component}</TableCell>
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
                                <Button onClick={layoutid ? handleUpdateSubmit : handleSubmit} className='bg-[#000] text-[#fff]' onPress={onClose}>
                                    {layoutid ? "Update" : "Create "}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <div className='w-full h-max flex'>
                <div className="flex-1 ">
                    <Heading title={`Multitabs (${TabsData?.length})`} description="Manage Tabs for your Frontend" />
                </div>
                <Butoon onOpen={onOpen} title={"Add New"} />
            </div>
            {Array.isArray(TabsData) && (
                <DataTableModel data={TabsData} setdata={setTabsData} columnss={columns} deleteitem={handleDelete} update={handleUpdate} />
            )}
        </div>
    )
}

export default Multipletabs;
