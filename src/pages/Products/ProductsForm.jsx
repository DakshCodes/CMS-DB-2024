import React from 'react'
import Heading from '../../components/ui/Heading'
import { Input, Button, Tabs, Tab, Card, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, } from "@nextui-org/react";
import Selected from '../../components/ui/Select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UploadImage } from '../../apicalls/user';
import { CreateProduct, EditProductById, GetProductDataByID } from '../../apicalls/product';
import toast from 'react-hot-toast';
import { SetLoader } from "../../redux/loadersSlice";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const ProductsForm = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();

    const productURL = params.id === "new" ? null : params.id;



    console.log("my product url : ", productURL)

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [imageLinks, setImageLinks] = React.useState([]);
    const [formValues, setFormValues] = React.useState({
        productName: '',
        regularPrice: '',
        salePrice: '',
        mainDescription: '',
        shortDescription: '',
        product_images: [],
        attributes: [{ type: '', value: '' }], //  attributes array
    });

    const { productName, regularPrice, salePrice, mainDescription, shortDescription, attributes } = formValues;

    React.useEffect(() => {
        const fetchProductDetails = async (id) => {
            try {
                dispatch(SetLoader(true));
                const response = await GetProductDataByID(id); // Replace with your API call to get product details
                dispatch(SetLoader(false));

                if (response.success) {
                    const productDetails = response.data; // Assuming the API response has a 'data' field containing product details
                    setFormValues(productDetails);
                    setImageLinks(productDetails.product_images);
                } else {
                    throw new Error(response.message);
                }
            } catch (error) {
                dispatch(SetLoader(false));
                console.error(error.message);
                toast.error(error.message);
            }
        };

        if (productURL) {
            fetchProductDetails(productURL);
        }
    }, [productURL])

    const handleChange = (field, value) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };

    const handleAttributeChange = (index, field, value) => {
        const updatedAttributes = [...attributes];
        updatedAttributes[index][field] = value;

        setFormValues((prevValues) => ({
            ...prevValues,
            attributes: updatedAttributes,
        }));
    };

    const addAttribute = () => {
        setFormValues((prevValues) => ({
            ...prevValues,
            attributes: [...prevValues.attributes, { type: '', value: '' }],
        }));
    };

    const removeAttribute = (index) => {
        const updatedAttributes = [...attributes];
        updatedAttributes.splice(index, 1);

        setFormValues((prevValues) => ({
            ...prevValues,
            attributes: updatedAttributes,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();



        formValues.product_images = imageLinks;
        // Use the 'formValues' object as needed, for example, send it to an API or perform other actions
        console.log('Form Values:', formValues);


        try {
            let response = {};

            if (productURL) {
                // edit
                console.log("Edit form Values -------------", formValues);
                dispatch(SetLoader(true));
                response = await EditProductById(formValues, productURL);
                dispatch(SetLoader(false));

            } else {

                dispatch(SetLoader(true));
                response = await CreateProduct(formValues);
                dispatch(SetLoader(false));
            }
            console.log(response);

            if (response.success) {
                toast.success(response.message)
                navigate("/products")
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



    const handleImageChange = (e) => {
        const name = e.target.name;
        const value = e.target.files[0];
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };
    

    const uploadImage = async (e) => {
        e.preventDefault();
        try {
            dispatch(SetLoader(true));
            const formData = new FormData();
            formData.append("product_images", formValues.product_images);
            const response = await UploadImage(formData);
            dispatch(SetLoader(false));

            if (response.success) {
                const newImageLink = response.url;
                setImageLinks((prevLinks) => [...prevLinks, newImageLink]);
                toast.success(response.message);
            } else {
                console.log(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            console.log(error.message);
        }
    };


    const users = [
        {
            id: 1,
            name: "Tony Reichert",
            role: "CEO",
            team: "Management",
            status: "active",
            age: "29",
            avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
            email: "tony.reichert@example.com",
        },
        {
            id: 2,
            name: "Zoey Lang",
            role: "Tech Lead",
            team: "Development",
            status: "paused",
            age: "25",
            avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
            email: "zoey.lang@example.com",
        },
        {
            id: 3,
            name: "Jane Fisher",
            role: "Sr. Dev",
            team: "Development",
            status: "active",
            age: "22",
            avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/2.png",
            email: "jane.fisher@example.com",
        },
    ];

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-8 p-8 pt-6">
                <div className="flex items-center justify-between border-b  pb-3 ">
                    <Heading title={productURL ? "Edit Products" : "Create Products"} description={!productURL ? "Add a new Prouduct" : "Edit a prodcut"} />
                </div>
                <form onSubmit={handleSubmit} className="space-y-8 w-full">
                    <div className="flex w-full flex-col ">
                        <Input
                            type="name"
                            label="Name"
                            variant='underlined'
                            labelPlacement={'outside'}
                            className="font font-bold w-full"
                            placeholder="Product Name"
                            value={productName}
                            onChange={(e) => handleChange('productName', e.target.value)}
                        />

                        <div className='mt-4'>
                            <div className='font-sans font-semibold my-4'>Main Description</div>

                            <ReactQuill
                                theme="snow"
                                value={mainDescription}
                                onChange={(value) => handleChange('mainDescription', value)}
                            />

                        </div>

                        <Tabs aria-label="Options" color={'primary'} className="font-sans font-bold mt-10" variant="bordered">
                            <Tab key="photos" title="Genral" >
                                <Card className='px-5 py-4  gap-5 flex-row items-center'>
                                    <div className='flex gap-3'>
                                        <Input
                                            type="number"
                                            label="Regular price"
                                            placeholder="0.00"
                                            labelPlacement="inside"
                                            className="font font-semibold w-[10rem]"
                                            value={regularPrice}
                                            onChange={(e) => handleChange('regularPrice', e.target.value)}
                                            startContent={
                                                <div className="pointer-events-none flex items-center">
                                                    <span className="text-default-400 text-small">₹</span>
                                                </div>
                                            }
                                        />
                                        <Input
                                            type="number"
                                            label="Sale price"
                                            placeholder="0.00"
                                            labelPlacement="inside"
                                            className="font font-semibold w-[10rem]"
                                            value={salePrice}
                                            onChange={(e) => handleChange('salePrice', e.target.value)}
                                            startContent={
                                                <div className="pointer-events-none flex items-center">
                                                    <span className="text-default-400 text-small">₹</span>
                                                </div>
                                            }
                                        />
                                    </div>
                                    {/* <div className='flex gap-3'>
                                        <Selected title={"Tax status"} />
                                        <Selected title={"Tax class"} />
                                    </div> */}
                                </Card>
                            </Tab>
                            <Tab key="attributes" title="Attributes">
                                {/* Attribute add model */}
                                <Modal
                                    isOpen={isOpen}
                                    placement={"top-center"}
                                    onOpenChange={onOpenChange}
                                >
                                    <ModalContent>
                                        {(onClose) => (
                                            <>
                                                <ModalHeader className="flex flex-col gap-1">Create Attribute</ModalHeader>
                                                <ModalBody>
                                                    <Input size={'sm'}
                                                        classNames={{
                                                            label: "font-bold font-3",
                                                            input: "font-bold font",
                                                        }}

                                                        type="text" label="Name" />
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button color="danger" variant="light" onPress={onClose}>
                                                        Close
                                                    </Button>
                                                    <Button className='bg-[#000] text-[#fff]' onPress={onClose}>
                                                        Create
                                                    </Button>
                                                </ModalFooter>
                                            </>
                                        )}
                                    </ModalContent>
                                </Modal>
                                <Card className='px-5 py-3 flex gap-5'>
                                    <Button onPress={onOpen} className="font-sans max-w-[7rem] bg-[#000]  font-semibold text-[0.8rem]" color='primary'>
                                        Add attribute
                                    </Button>
                                    <div className='flex flex-col gap-8 '>
                                        {attributes?.map((attribute, index) => (
                                            <div key={index} className='flex gap-5 max-w-max'>
                                                <Select
                                                    items={users}
                                                    placeholder="select attribute"
                                                    labelPlacement="outside"
                                                    variant='faded'
                                                    className="w-[10rem]  font font-bold"
                                                    onSelect={(user) => handleAttributeChange(index, 'type', user.name)}
                                                >
                                                    {(user) => (
                                                        <SelectItem key={user.id} textValue={user.name}>
                                                            <div className="flex gap-2 items-center">
                                                                <div className="flex flex-col">
                                                                    <span className="text-small font-bold">{user.name}</span>
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    )}
                                                </Select>
                                                <Input
                                                    type="url"
                                                    placeholder="value"
                                                    labelPlacement="outside"
                                                    className="max-w-[10rem]  font font-bold"
                                                    value={attribute.value}
                                                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                                />
                                                {!index == 0 && <Button
                                                    isIconOnly
                                                    color="warning"
                                                    variant="light"
                                                    onClick={() => removeAttribute(index)}
                                                >
                                                    <svg className='w-8 h-7' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12L18 12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                                </Button>
                                                }
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        isIconOnly
                                        color="primary"
                                        variant="light"
                                        onClick={addAttribute}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 12H15" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 9L12 15" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                    </Button>
                                </Card>
                            </Tab>
                            <Tab key="image" title="Images">
                                <Card className='p-4'>
                                    <input
                                        type="file"
                                        id="product_images"
                                        onChange={handleImageChange}
                                        placeholder='Product Image'
                                        className='text-center px-4 rounded-lg border-black h-full'
                                        name="product_images"
                                    />


                                    <Button isLoading={false} className="font-sans ml-auto text-[#fff] bg-[#000] font-medium" onClick={uploadImage}>
                                        Upload
                                    </Button>

                                </Card>
                                <Card className={"p-4 mt-4 max-h-[50rem] overflow-scroll"}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 p-4 ">
                                        {imageLinks && imageLinks.length > 0 ? (
                                            imageLinks.map((unitImage, index) => (
                                                <div key={index} className='w-[100%] border border-black rounded-xl h-[100%] col-span-1'>
                                                    <img className='w-full h-full object-cover rounded-xl' src={unitImage} alt="" />
                                                </div>
                                            ))
                                        ) : (
                                            <div className='font-sans font-semibold'>No images uploaded</div>
                                        )}
                                    </div>
                                </Card>
                            </Tab>

                        </Tabs>

                        <div className='mt-4'>
                            <div className='font-sans font-semibold my-4'>Short Description</div>
                            <ReactQuill
                                theme="snow"
                                value={shortDescription}
                                onChange={(value) => handleChange('shortDescription', value)}
                            />

                        </div>
                    </div>
                    <Button isLoading={false} className="font-sans ml-auto text-[#fff] bg-[#000] font-medium" type="submit">
                        Create
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default ProductsForm
