import React, { useEffect, useRef, useState } from 'react'
import { Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Card, Checkbox, Tabs, Tab, CardBody, Link } from "@nextui-org/react";
import Butoon from '../../components/ui/Butoon'
import Heading from '../../components/ui/Heading'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SetLoader } from "../../redux/loadersSlice";
import DataTableModel from '../../components/DateTableForModel/DataTableModel';
import { GetslidercomData, Createslidercom, Updateslidercom, Deleteslidercom } from '../../apicalls/slidercomponent';
import { UploadImage } from '../../apicalls/user';

const SliderComponent = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const fileInputRef = useRef(null)
    const dispatch = useDispatch();
    const [sliderData, setSliderData] = useState([]);
    const [loading, setloading] = useState(false);
    const [SliderId, setSliderId] = useState("");
    const [selectedImage, setSelectedImage] = useState('');
    const [isSelected, setIsSelected] = useState(false);
    const [selected, setSelected] = useState("");
    const [ImgTitle, setImgTitle] = useState("")

    const [slider, setSlider] = useState({
        heading: "",
        Images: [],
        visible: false,
        viewall: ""
    });

    const columns = [
        { name: "NAME", uid: "heading", },
        { name: "Created At", uid: "createdAt" },
        { name: "ACTIONS", uid: "actions" },
    ];

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

    useEffect(() => {
        getSliderData();
    }, []);

    const isAttributeNameUnique = (name) => {
        const lowerCaseName = name.toLowerCase();
        return !sliderData?.some((attribute) => attribute.heading.toLowerCase() === lowerCaseName);
    };

    const handleCloseModal = () => {
        setSelectedImage("");
        setSlider(null)
        setIsSelected(false)
    };

    const handleDelete = async (categoryId) => {
        try {
            dispatch(SetLoader(true));
            const response = await Deleteslidercom(categoryId);
            dispatch(SetLoader(false));
            if (response.success) {
                toast.success(response.message);
                setSliderData(prevData => prevData.filter(category => category._id !== categoryId));
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
            const response = await GetslidercomData();
            if (response.success) {
                const existingTag = response.slidercom.find((cat) => cat._id === categoryId);
                if (!existingTag) {
                    throw new Error("Slider not found");
                }

                onOpen();
                setSlider({ ...slider, heading: existingTag.heading, Images: existingTag.Images, visible: existingTag.visible, viewall: existingTag.viewall });
                setIsSelected(existingTag?.visible)
                setSliderId(categoryId)
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Error updating Slider:", error.message);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            slider.visible = isSelected;

            dispatch(SetLoader(true));
            const response = await Updateslidercom(SliderId, slider);

            dispatch(SetLoader(false));

            if (response.success) {
                toast.success(response.message);
                setSliderData((prevData) =>
                    prevData.map((category) =>
                        category._id === SliderId
                            ? { ...category, heading: slider.heading, Images: slider.Images, visible: slider.visible, viewall: slider.viewall }
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

            if (!isAttributeNameUnique(slider.heading)) {
                toast.error("Heading name must be unique.");
                return;
            }

            if (!(slider?.Images?.length >= 6)) {
                toast.error("Images must be 6.");
                return;
            }

            slider.visible = isSelected;

            dispatch(SetLoader(true));
            const response = await Createslidercom(slider);
            dispatch(SetLoader(false));

            if (response.success) {
                toast.success(response.message);
                console.log(response.slidercomDoc, "res data");
                setSliderData(prevData => {
                    // Check if prevData is an array, if not, initialize as an empty array
                    const newData = Array.isArray(prevData) ? prevData : [];

                    // Spread the elements of newData and add the new data
                    return [...newData, { _id: response.slidercomDoc._id, heading: response.slidercomDoc.heading, Images: response.slidercomDoc.Images, createdAt: response.slidercomDoc.createdAt, visible: response.slidercomDoc.visible, viewall: response.slidercomDoc.viewall, actions: "" }];
                });
                setSlider({});
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            console.log(error.message);
            toast.error(error.message);
        }
    };


    const handleImageChange = (e) => {
        const value = e.target.files[0];
        setSelectedImage(value);
    };

    const uploadImage = async (e) => {
        e.preventDefault();
        try {
            if (!ImgTitle) {
                toast.error('Please Add Overlay Title ?');
                return false;
            }
            if (!selectedImage) {
                toast.error('Please Add Image ?');
                return false;
            }

            const formData = new FormData();
            formData.append('product_images', selectedImage);

            setloading(true)
            const response = await UploadImage(formData);
            setloading(false)

            if (response.success) {
                const newImageLink = response.url;
                if (slider && Array.isArray(slider.Images)) {
                    setSlider({ ...slider, Images: [...slider.Images, { title: ImgTitle, src: newImageLink }] });
                } else {
                    toast.error("layout is undefined or layout.Images is not an array:", slider);
                }
                setSelectedImage("");
                setImgTitle("")
                toast.success(response.message);
            } else {
                console.log(response.message);
            }
        } catch (error) {
            setloading(false)
            console.log(error.message);
        }
    };
    // console.log(slider, "slider")
    console.log(sliderData, "Data")

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
                size="4xl"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-2xl font-bold font-sans  mb-3">{SliderId ? "Update Slider" : "Create Slider"}</ModalHeader>

                            <ModalBody className='flex flex-col gap-6'>
                                <div className="flex flex-col w-full">
                                    <h1 className='font-[600] font-sans m-auto text-[1rem] mb-5'>Select The Type Of Slider !</h1>
                                    <Card className="max-w-full max-h-full">
                                        <CardBody className="overflow-hidden">
                                            <Tabs
                                                fullWidth
                                                size="lg"
                                                aria-label="Tabs form"
                                                selectedKey={selected}
                                                onSelectionChange={setSelected}
                                                disabledKeys={(slider?.viewall === "Categories") && ["Products"] || (slider?.viewall === "Products") && ["Categories"]}
                                            >
                                                <Tab key="Categories"
                                                    className="py-6 flex flex-col gap-10 font-[400] font"
                                                    title={(slider?.viewall === "Products") ? "You Can Only Create One" : "Categories"}>
                                                    <Input size={'md'}
                                                        classNames={{
                                                            label: "font-[600] font-3",
                                                            input: "font-[600] font-sans",
                                                        }}
                                                        labelPlacement="outside"
                                                        type="text" label="Slider Heading"
                                                        placeholder='New Arrivals'
                                                        onChange={(e) => setSlider({ ...slider, heading: e.target.value, viewall: selected })}
                                                        value={slider?.heading}
                                                        variant="flat"
                                                    />
                                                    <div className="img-form flex flex-col gap-5">
                                                        <h1 className='font font-[600]'>Add Your Images For Slider (minimum 6)</h1>
                                                        <div className='flex gap-5 justify-start' >
                                                            <Input size={'md'}
                                                                classNames={{
                                                                    base: "max-w-[15rem]",
                                                                    label: "font-[600] font-3",
                                                                    input: "font-[600] font-sans ",
                                                                }}
                                                                labelPlacement="outside"
                                                                type="text"
                                                                placeholder='Overlay-Title'
                                                                onChange={(e) => setImgTitle(e.target.value)}
                                                                value={ImgTitle}
                                                                variant="flat"
                                                            />
                                                            <Button color={(slider?.Images?.length === 6) ? "danger" : "success"}
                                                                className='font-sans  text-[#fff] font-[900]'
                                                                endContent={(slider?.Images?.length === 6 ? ("") : (<svg
                                                                    width={44}
                                                                    height={30}
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M17.44 6.236c.04.07.11.12.2.12 2.4 0 4.36 1.958 4.36 4.355v5.934A4.368 4.368 0 0117.64 21H6.36A4.361 4.361 0 012 16.645V10.71a4.361 4.361 0 014.36-4.355c.08 0 .16-.04.19-.12l.06-.12.106-.222a97.79 97.79 0 01.714-1.486C7.89 3.51 8.67 3.01 9.64 3h4.71c.97.01 1.76.51 2.22 1.408.157.315.397.822.629 1.31l.141.299.1.22zm-.73 3.836c0 .5.4.9.9.9s.91-.4.91-.9-.41-.909-.91-.909-.9.41-.9.91zm-6.44 1.548c.47-.47 1.08-.719 1.73-.719.65 0 1.26.25 1.72.71.46.459.71 1.068.71 1.717A2.438 2.438 0 0112 15.756c-.65 0-1.26-.25-1.72-.71a2.408 2.408 0 01-.71-1.717v-.01c-.01-.63.24-1.24.7-1.699zm4.5 4.485a3.91 3.91 0 01-2.77 1.15 3.921 3.921 0 01-3.93-3.926 3.865 3.865 0 011.14-2.767A3.921 3.921 0 0112 9.402c1.05 0 2.04.41 2.78 1.15.74.749 1.15 1.738 1.15 2.777a3.958 3.958 0 01-1.16 2.776z"
                                                                        fill={"#fff"}
                                                                    />
                                                                </svg>))}
                                                                onClick={() => fileInputRef.current.click()}
                                                                disabled={(slider?.Images?.length === 6)}
                                                            >
                                                                {(slider?.Images?.length === 6) && "Limit Over" || (!selectedImage?.name > 0 ? `${6 - (slider?.Images?.length || 0) + ""} Image remaining` : selectedImage?.type)}
                                                            </Button>
                                                            <input
                                                                ref={fileInputRef}
                                                                type="file"
                                                                id="product_images"
                                                                onChange={handleImageChange}
                                                                placeholder='Product Image'
                                                                className='text-center px-4 rounded-lg border-black h-full hidden'
                                                                name="product_images"
                                                            />
                                                            <Button isLoading={loading} className="font-sans ml-auto text-[#fff] bg-[#000] font-medium" onClick={uploadImage}>
                                                                Upload
                                                            </Button>
                                                        </div>
                                                        <Checkbox className='mt-3 mx-2 font-sans font-[600]' color='primary' isSelected={isSelected} onValueChange={setIsSelected}>
                                                            Visible
                                                        </Checkbox>
                                                    </div>
                                                    <Card className={"p-4 mt-4 max-h-[50rem] w-full overflow-scroll"}>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 p-4 ">
                                                            {slider?.Images && slider?.Images?.length > 0 ? (
                                                                slider?.Images.map((unitImage, index) => (
                                                                    <div key={index} className='w-[100%]  h-[100%] col-span-1'>
                                                                        <img className='w-full h-full object-cover rounded-xl' src={unitImage?.src} alt="" />
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className='font-sans font-semibold'>No images</div>
                                                            )}
                                                        </div>
                                                    </Card>
                                                </Tab>
                                                <Tab
                                                    className="py-6 flex flex-col gap-10 font-[400] font"
                                                    key="Products" title={(slider?.viewall === "Categories") ? "You Can Only Create One" : "Products"}>
                                                    <Input size={'md'}
                                                        classNames={{
                                                            label: "font-[600] font-3",
                                                            input: "font-[600] font-sans",
                                                        }}
                                                        labelPlacement="outside"
                                                        type="text" label="Slider Heading"
                                                        placeholder='New Arrivals'
                                                        onChange={(e) => setSlider({ ...slider, heading: e.target.value, viewall: selected })}
                                                        value={slider?.heading}
                                                        variant="flat"
                                                    />
                                                    <div className="img-form flex flex-col gap-5">
                                                        <h1 className='font font-[600]'>Add Your Images For Slider (minimum 6)</h1>
                                                        <div className='flex gap-5 justify-start' >
                                                            <Input size={'md'}
                                                                classNames={{
                                                                    base: "max-w-[15rem]",
                                                                    label: "font-[600] font-3",
                                                                    input: "font-[600] font-sans ",
                                                                }}
                                                                labelPlacement="outside"
                                                                type="text"
                                                                placeholder='Overlay-Title'
                                                                onChange={(e) => setImgTitle(e.target.value)}
                                                                value={ImgTitle}
                                                                variant="flat"
                                                            />
                                                            <Button color={(slider?.Images?.length === 6) ? "danger" : "success"}
                                                                className='font-sans  text-[#fff] font-[900]'
                                                                endContent={(slider?.Images?.length === 6 ? ("") : (<svg
                                                                    width={44}
                                                                    height={30}
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M17.44 6.236c.04.07.11.12.2.12 2.4 0 4.36 1.958 4.36 4.355v5.934A4.368 4.368 0 0117.64 21H6.36A4.361 4.361 0 012 16.645V10.71a4.361 4.361 0 014.36-4.355c.08 0 .16-.04.19-.12l.06-.12.106-.222a97.79 97.79 0 01.714-1.486C7.89 3.51 8.67 3.01 9.64 3h4.71c.97.01 1.76.51 2.22 1.408.157.315.397.822.629 1.31l.141.299.1.22zm-.73 3.836c0 .5.4.9.9.9s.91-.4.91-.9-.41-.909-.91-.909-.9.41-.9.91zm-6.44 1.548c.47-.47 1.08-.719 1.73-.719.65 0 1.26.25 1.72.71.46.459.71 1.068.71 1.717A2.438 2.438 0 0112 15.756c-.65 0-1.26-.25-1.72-.71a2.408 2.408 0 01-.71-1.717v-.01c-.01-.63.24-1.24.7-1.699zm4.5 4.485a3.91 3.91 0 01-2.77 1.15 3.921 3.921 0 01-3.93-3.926 3.865 3.865 0 011.14-2.767A3.921 3.921 0 0112 9.402c1.05 0 2.04.41 2.78 1.15.74.749 1.15 1.738 1.15 2.777a3.958 3.958 0 01-1.16 2.776z"
                                                                        fill={"#fff"}
                                                                    />
                                                                </svg>))}
                                                                onClick={() => fileInputRef.current.click()}
                                                                disabled={(slider?.Images?.length === 6)}
                                                            >
                                                                {(slider?.Images?.length === 6) && "Limit Over" || (!selectedImage?.name > 0 ? `${6 - (slider?.Images?.length || 0) + ""} Image remaining` : selectedImage?.type)}
                                                            </Button>
                                                            <input
                                                                ref={fileInputRef}
                                                                type="file"
                                                                id="product_images"
                                                                onChange={handleImageChange}
                                                                placeholder='Product Image'
                                                                className='text-center px-4 rounded-lg border-black h-full hidden'
                                                                name="product_images"
                                                            />
                                                            <Button isLoading={loading} className="font-sans ml-auto text-[#fff] bg-[#000] font-medium" onClick={uploadImage}>
                                                                Upload
                                                            </Button>
                                                        </div>
                                                        <Checkbox className='mt-3 mx-2 font-sans font-[600]' color='primary' isSelected={isSelected} onValueChange={setIsSelected}>
                                                            Visible
                                                        </Checkbox>
                                                    </div>
                                                    <Card className={"p-4 mt-4 max-h-[50rem] w-full overflow-scroll"}>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 p-4 ">
                                                            {slider?.Images && slider?.Images?.length > 0 ? (
                                                                slider?.Images.map((unitImage, index) => (
                                                                    <div key={index} className='w-[100%]  h-[100%] col-span-1'>
                                                                        <img className='w-full h-full object-cover rounded-xl' src={unitImage?.src} alt="" />
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className='font-sans font-semibold'>No images</div>
                                                            )}
                                                        </div>
                                                    </Card>
                                                </Tab>
                                            </Tabs>
                                        </CardBody>
                                    </Card>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button onClick={SliderId ? handleUpdateSubmit : handleSubmit} className='bg-[#000] text-[#fff]' onPress={onClose}>
                                    {SliderId ? "Update" : "Create "}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <div className='w-full h-max flex'>
                <div className="flex-1 ">
                    <Heading title={`Sliders (${sliderData?.length || 0})`} description="Manage Sliders for your Frontend" />
                </div>
                <Butoon onOpen={onOpen} title={"Add New"} />
            </div>
            {Array.isArray(sliderData) && (
                <DataTableModel data={sliderData} setdata={setSliderData} columnss={columns} deleteitem={handleDelete} update={handleUpdate} />
            )}
        </div>
    )
}

export default SliderComponent;
