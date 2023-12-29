import React, { useState } from 'react'
import Heading from '../../components/ui/Heading'
import { Input, Button, Tabs, Tab, Card, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Avatar, Chip, } from "@nextui-org/react";
import Selected from '../../components/ui/Select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UploadImage } from '../../apicalls/user';
import { CreateProduct, EditProductById, GetProductDataByID } from '../../apicalls/product';
import toast from 'react-hot-toast';
import { SetLoader } from "../../redux/loadersSlice";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GetAttributeData } from '../../apicalls/attributes';

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

    React.useEffect(() => {
        getAttributeData();
    }, [])

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
        {
          id: 4,
          name: "William Howard",
          role: "C.M.",
          team: "Marketing",
          status: "vacation",
          age: "28",
          avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/2.png",
          email: "william.howard@example.com",
        },
        {
          id: 5,
          name: "Kristen Copper",
          role: "S. Manager",
          team: "Sales",
          status: "active",
          age: "24",
          avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/3.png",
          email: "kristen.cooper@example.com",
        },
        {
          id: 6,
          name: "Brian Kim",
          role: "P. Manager",
          team: "Management",
          age: "29",
          avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/3.png",
          email: "brian.kim@example.com",
          status: "Active",
        },
        {
          id: 7,
          name: "Michael Hunt",
          role: "Designer",
          team: "Design",
          status: "paused",
          age: "27",
          avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/4.png",
          email: "michael.hunt@example.com",
        },
        {
          id: 8,
          name: "Samantha Brooks",
          role: "HR Manager",
          team: "HR",
          status: "active",
          age: "31",
          avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/4.png",
          email: "samantha.brooks@example.com",
        },
        {
          id: 9,
          name: "Frank Harrison",
          role: "F. Manager",
          team: "Finance",
          status: "vacation",
          age: "33",
          avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/5.png",
          email: "frank.harrison@example.com",
        },
        {
          id: 10,
          name: "Emma Adams",
          role: "Ops Manager",
          team: "Operations",
          status: "active",
          age: "35",
          avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/5.png",
          email: "emma.adams@example.com",
        },
        {
          id: 11,
          name: "Brandon Stevens",
          role: "Jr. Dev",
          team: "Development",
          status: "active",
          age: "22",
          avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/7.png",
          email: "brandon.stevens@example.com",
        },
        {
          id: 12,
          name: "Megan Richards",
          role: "P. Manager",
          team: "Product",
          status: "paused",
          age: "28",
          avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/7.png",
          email: "megan.richards@example.com",
        },
        {
          id: 13,
          name: "Oliver Scott",
          role: "S. Manager",
          team: "Security",
          status: "active",
          age: "37",
          avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/8.png",
          email: "oliver.scott@example.com",
        },
        {
          id: 14,
          name: "Grace Allen",
          role: "M. Specialist",
          team: "Marketing",
          status: "active",
          age: "30",
          avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/8.png",
          email: "grace.allen@example.com",
        },
        {
          id: 15,
          name: "Noah Carter",
          role: "IT Specialist",
          team: "I. Technology",
          status: "paused",
          age: "31",
          avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/9.png",
          email: "noah.carter@example.com",
        },
        {
          id: 16,
          name: "Ava Perez",
          role: "Manager",
          team: "Sales",
          status: "active",
          age: "29",
          avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/9.png",
          email: "ava.perez@example.com",
        },
        {
          id: 17,
          name: "Liam Johnson",
          role: "Data Analyst",
          team: "Analysis",
          status: "active",
          age: "28",
          avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/11.png",
          email: "liam.johnson@example.com",
        },
        {
          id: 18,
          name: "Sophia Taylor",
          role: "QA Analyst",
          team: "Testing",
          status: "active",
          age: "27",
          avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/11.png",
          email: "sophia.taylor@example.com",
        },
        {
          id: 19,
          name: "Lucas Harris",
          role: "Administrator",
          team: "Information Technology",
          status: "paused",
          age: "32",
          avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/12.png",
          email: "lucas.harris@example.com",
        },
        {
          id: 20,
          name: "Mia Robinson",
          role: "Coordinator",
          team: "Operations",
          status: "active",
          age: "26",
          avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/12.png",
          email: "mia.robinson@example.com",
        },
      ];

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

                                <Card className='px-5 py-3 flex gap-5'>
                                    <div className='flex flex-col gap-8 '>
                                        {attributes?.map((attribute, index) => (
                                            <div key={index} className='flex gap-5 max-w-max'>
                                                <Select
                                                    items={attributeData}
                                                    placeholder="Select Attribute"
                                                    labelPlacement="outside"
                                                    variant='faded'
                                                    className="w-[40rem]  font font-bold"
                                                    onSelect={(attributeData) => handleAttributeChange(index, 'type', attributeData.name)}
                                                >
                                                    {(attributeData) => (
                                                        <SelectItem key={attributeData._id} textValue={attributeData.name}>
                                                            <div className="flex gap-2 items-center">
                                                                <div className="flex flex-col">
                                                                    <span className="text-small font-bold">{attributeData.name}</span>
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    )}
                                                </Select>
                                                <Select
                                                    items={users}
                                                    variant='faded'
                                                    isMultiline={true}
                                                    selectionMode="multiple"
                                                    placeholder="Select a user"
                                                    labelPlacement="outside"
                                                    className="w-[40rem]  font font-bold"

                                                    renderValue={(items) => {
                                                        return (
                                                            <div className="flex flex-wrap gap-2">
                                                                {items.map((item) => (
                                                                    <Chip key={item.key}>{item.data.name}</Chip>
                                                                ))}
                                                            </div>
                                                        );
                                                    }}
                                                >
                                                    {(user) => (
                                                        <SelectItem key={user.id} textValue={user.name}>
                                                            <div className="flex gap-2 items-center">
                                                                <Avatar alt={user.name} className="flex-shrink-0" size="sm" src={user.avatar} />
                                                                <div className="flex flex-col">
                                                                    <span className="text-small">{user.name}</span>
                                                                    <span className="text-tiny text-default-400">{user.email}</span>
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    )}
                                                </Select>

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
