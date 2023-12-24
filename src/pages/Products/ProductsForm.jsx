import React from 'react'
import Heading from '../../components/ui/Heading'
import { Input, Button, Tabs, Tab, Card } from "@nextui-org/react";
import Selected from '../../components/ui/Select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UploadImage } from '../../apicalls/user';
import { CreateProduct } from '../../apicalls/product';
import toast from 'react-hot-toast';
import { SetLoader } from "../../redux/loadersSlice";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const ProductsForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formValues, setFormValues] = React.useState({
        productName: '',
        regularPrice: '',
        salePrice: '',
        mainDescription: '',
        shortDescription: '',
        product_images: [],
    });

    const { productName, regularPrice, salePrice, mainDescription, shortDescription } = formValues;

    const handleChange = (field, value) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        formValues.product_images = imageLinks;
        // Use the 'formValues' object as needed, for example, send it to an API or perform other actions
        console.log('Form Values:', formValues);

        try {
            dispatch(SetLoader(true));
            const response = await CreateProduct(formValues);
            dispatch(SetLoader(false));
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


    const [imageLinks, setImageLinks] = React.useState([]);

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
            const formData = new FormData();
            formData.append("product_images", formValues.product_images);
            const response = await UploadImage(formData);
            if (response.success) {
                alert(response.message);
                const newImageLink = response.url;
                setImageLinks((prevLinks) => [...prevLinks, newImageLink]);

            } else {
                console.log(response.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };


    let tabs = [
        {
            id: "photos",
            label: "Photos",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            id: "music",
            label: "Music",
            content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
        },
        {
            id: "videos",
            label: "Videos",
            content: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }
    ];

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-8 p-8 pt-6">
                <div className="flex items-center justify-between border-b  pb-3 ">
                    <Heading title={"Create Products"} description={"Add a new Prouduct"} />
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
                                <Card>
                                    hey
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
