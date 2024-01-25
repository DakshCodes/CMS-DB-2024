import React, { useEffect, useRef, useState } from 'react'
import { Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Card, Checkbox } from "@nextui-org/react";
import Butoon from '../../components/ui/Butoon'
import Heading from '../../components/ui/Heading'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SetLoader } from "../../redux/loadersSlice";
import DataTableModel from '../../components/DateTableForModel/DataTableModel';
import { GetlayoutimgData, Createlayoutimg, Updatelayoutimg, Deletelayoutimg } from '../../apicalls/layoutimages';
import { UploadImage } from '../../apicalls/user';

const ImageLayout = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const fileInputRef = useRef(null)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [layoutData, setLayoutData] = useState([]);
    const [loading, setloading] = useState(false);
    const [layoutid, setlayoutid] = useState("");
    const [selectedImage, setSelectedImage] = useState('');
    const [isSelected, setIsSelected] = useState(false);

    const [layout, setLayout] = useState({
        name: "",
        Images: [],
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
            const response = await GetlayoutimgData();
            dispatch(SetLoader(false));
            if (response.success) {
                setLayoutData(response.layoutimg);
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
    }, []);

    const isAttributeNameUnique = (name) => {
        const lowerCaseName = name.toLowerCase();
        return !layoutData.some((attribute) => attribute.name.toLowerCase() === lowerCaseName);
    };

    const handleCloseModal = () => {
        setSelectedImage("");
        setLayout(null)
        setIsSelected(false)
    };

    const handleDelete = async (categoryId) => {
        try {
            dispatch(SetLoader(true));
            const response = await Deletelayoutimg(categoryId);
            dispatch(SetLoader(false));
            if (response.success) {
                toast.success(response.message);
                setLayoutData(prevData => prevData.filter(category => category._id !== categoryId));
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
            const response = await GetlayoutimgData();
            if (response.success) {
                const existingTag = response.layoutimg.find((cat) => cat._id === categoryId);
                if (!existingTag) {
                    throw new Error("Category not found");
                }

                onOpen();
                setLayout({ ...layout, name: existingTag.name, Images: existingTag.Images, visible: existingTag.visible });
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
            const response = await Updatelayoutimg(layoutid, layout);

            dispatch(SetLoader(false));

            if (response.success) {
                toast.success(response.message);
                setLayoutData((prevData) =>
                    prevData.map((category) =>
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
                toast.error("Tag name must be unique.");
                return;
            }
            if (!(layout?.Images?.length >= 5)) {
                true
                toast.error("Images must be 5.");
                return;
            }
            layout.visible = isSelected;
            dispatch(SetLoader(true));
            const response = await Createlayoutimg(layout);

            dispatch(SetLoader(false));

            if (response.success) {
                toast.success(response.message)
                setLayoutData(prevData => [...prevData, { _id: response.layoutimgDoc._id, name: response.layoutimgDoc.name, Images: response.layoutimgDoc.Images, createdAt: response.layoutimgDoc.createdAt,visible: response.layoutimgDoc.visible, actions: "" }]);
                setLayout({ name: "", Images: [] });
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            console.log(error.message)
            toast.error(error.message)
        }
    };

    const handleImageChange = (e) => {
        const value = e.target.files[0];
        setSelectedImage(value);
    };

    const uploadImage = async (e) => {
        e.preventDefault();
        try {
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
                if (layout && Array.isArray(layout.Images)) {
                    setLayout({ ...layout, Images: [...layout.Images, { src: newImageLink }] });
                } else {
                    toast.error("layout is undefined or layout.Images is not an array:", layout);
                }
                setSelectedImage("");
                toast.success(response.message);
            } else {
                console.log(response.message);
            }
        } catch (error) {
            setloading(false)
            console.log(error.message);
        }
    };

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
                size="xl"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-2xl font-bold font-sans  mb-3">{layoutid ? "Update Layout" : "Create Layout"}</ModalHeader>

                            <ModalBody className='flex flex-col gap-6'>
                                <Input size={'md'}
                                    classNames={{
                                        label: "font-[600] font-3",
                                        input: "font-[600] font-sans",
                                    }}
                                    labelPlacement="outside"
                                    type="text" label="Layout name"
                                    placeholder='Diwali'
                                    onChange={(e) => setLayout({ ...layout, name: e.target.value })}
                                    value={layout?.name}
                                    variant="flat"
                                />
                                <div className="img-form flex flex-col gap-5">
                                    <h1 className='font font-[600]'>Add Your 5 Images</h1>
                                    <div className='flex gap-5 justify-start' >
                                        <Button color={(layout?.Images?.length === 5) ? "danger" : "success"}
                                            className='font-sans  text-[#fff] font-[900]'
                                            endContent={(layout?.Images?.length === 5 ? ("") : (<svg
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
                                            disabled={(layout?.Images?.length === 5)}
                                        >
                                            {(layout?.Images?.length === 5) && "Limit Over" || (!selectedImage?.name > 0 ? "Images Upload" : selectedImage?.type)}
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
                                        {layout?.Images && layout?.Images?.length > 0 ? (
                                            layout?.Images.map((unitImage, index) => (
                                                <div key={index} className='w-[100%]  h-[100%] col-span-1'>
                                                    <img className='w-full h-full object-cover rounded-xl' src={unitImage?.src} alt="" />
                                                </div>
                                            ))
                                        ) : (
                                            <div className='font-sans font-semibold'>No images</div>
                                        )}
                                    </div>
                                </Card>
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
                    <Heading title={`Layouts (${layoutData.length})`} description="Manage Layouts for your Frontend" />
                </div>
                <Butoon onOpen={onOpen} title={"Add New"} />
            </div>
            {Array.isArray(layoutData) && (
                <DataTableModel data={layoutData} setdata={setLayoutData} columnss={columns} deleteitem={handleDelete} update={handleUpdate} />
            )}
        </div>
    )
}

export default ImageLayout;
