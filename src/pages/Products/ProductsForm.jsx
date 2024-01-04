import React, { useState } from 'react';
import Heading from '../../components/ui/Heading';
import {
    Input,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tabs,
    Tab,
    Card,
    Select,
    SelectItem,
    useDisclosure,
    Avatar,
    Chip,
} from '@nextui-org/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UploadImage } from '../../apicalls/user';
import { CreateProduct, EditProductById, GetProductDataByID } from '../../apicalls/product';
import toast from 'react-hot-toast';
import { SetLoader } from '../../redux/loadersSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GetAttributeData } from '../../apicalls/attributes';
import { GetTagData } from '../../apicalls/tag';

const ProductsForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();

    const [tableData, setTableData] = useState([]);
    const [valuedata, setvaluedata] = useState('');
    const [selectvalue, setselectvalue] = useState(new Set([]));
    const [selectedtags, setSelectedtags] = useState(new Set([]));
    const [selectedAttribute, setSelectedAttribute] = useState(null);
    // State for selected tag
    const [selectedTag, setSelectedTag] = useState(new Set([]));

    // State for input value
    const [inputValue, setInputValue] = useState('');

    // State for table values
    const [highlightsValuesTable, setHighlightsValuesTable] = useState([]);

    const productURL = params.id === 'new' ? null : params.id;

    const [imageLinks, setImageLinks] = React.useState([]);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [formValues, setFormValues] = React.useState({
        productName: '',
        regularPrice: '',
        salePrice: '',
        mainDescription: '',
        shortDescription: '',
        product_images: [],
        attributes: [], // New field to store attributes array of objects
        producthighlights: [], // New field to store attributes array of objects
        tags: [], // New field to store tags array of objects
    });

    const { productName, regularPrice, salePrice, mainDescription, shortDescription } = formValues;


    React.useEffect(() => {
        const fetchProductDetails = async (id) => {
            try {
                dispatch(SetLoader(true));
                const response = await GetProductDataByID(id);
                dispatch(SetLoader(false));

                if (response.success) {
                    const productDetails = response.data;
                    setFormValues({ ...productDetails, attributes: [] });
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
    }, [productURL]);

    const handleChange = (field, value) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };
    const [tagsData, setTagsData] = useState([])

    const getTagsData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetTagData();
            dispatch(SetLoader(false));
            if (response.success) {
                setTagsData(response.tag);
                console.log(response.tag)
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            toast.error(error.message)
        }
    }

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
            toast.error(error.message);
        }
    };

    React.useEffect(() => {
        getAttributeData();
        getTagsData();
    }, [setTagsData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        formValues.tags = selectedtags;
        formValues.product_images = imageLinks;

        console.log(formValues)

        try {
            let response = {};

            if (productURL) {
                dispatch(SetLoader(true));
                response = await EditProductById(formValues, productURL);
                dispatch(SetLoader(false));
            } else {
                dispatch(SetLoader(true));
                response = await CreateProduct(formValues);
                dispatch(SetLoader(false));
            }

            if (response.success) {
                toast.success(response.message);
                navigate('/products');
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
            formData.append('product_images', formValues.product_images);
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

    const changeSelect = (e) => {
        const selectedAttributeName = e.target.value;
        const selectedAttribute = attributeData.find((attribute) => attribute.name === selectedAttributeName);
        setvaluedata(selectedAttribute);
        setSelectedAttribute(selectedAttribute);
    };

    const addAttributeToTable = (stock) => {
        if (selectedAttribute) {
            // Add new row
            const newTableData = [
                ...tableData,
                {
                    values: selectvalue,
                    stock: stock,
                },
            ];

            setTableData(newTableData);

            // Update the formValues with the new attribute
            setFormValues((prevValues) => ({
                ...prevValues,
                attributes: newTableData.map((attribute) => ({
                    values: attribute.values,
                    stock: attribute.stock,
                })),
            }));
        }
    };




    const removeAttributeFromTable = (index) => {
        const newTableData = [...tableData];
        newTableData.splice(index, 1);
        setTableData(newTableData);

        // Update the formValues without the removed attribute
        setFormValues((prevValues) => ({
            ...prevValues,
            attributes: prevValues.attributes.filter((_, i) => i !== index),
        }));
    };

    const handletagsSelectionChange = (e) => {
        setSelectedtags(e.target.value.split(","));
    };
    const handleSelectionChange = (e) => {
        setselectvalue(e.target.value.split(","));
    };
    const handleSelectedTagChange = (e) => {
        setSelectedTag(e.target.value)
    };


    // Function to handle input value change
    const handleInputValueChange = (event) => {
        setInputValue(event.target.value);
    };

    // Function to handle "plus" button click
    const handlePlusButtonClick = () => {
        if (selectedTag && inputValue) {
            // Create a new row object
            const newTableData = [
                ...highlightsValuesTable,
                {
                    highlight: selectedTag,
                    value: inputValue,
                }
            ];


            // Update the table state
            setHighlightsValuesTable(newTableData);

            setFormValues((prevValues) => ({
                ...prevValues,
                producthighlights: newTableData.map((attribute) => ({
                    highlight: attribute.highlight,
                    value: attribute.value,
                })),
            }));
            // Clear selected tag and input value
            setSelectedTag(null);
            setInputValue('');
        }
    };

    // Function to handle row deletion
    const handleDeleteRow = (index) => {
        const updatedTable = [...highlightsValuesTable];
        updatedTable.splice(index, 1);
        setHighlightsValuesTable(updatedTable);
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
                                <Card className='px-5 py-5 flex gap-5'>
                                    <div className='flex flex-col gap-8 '>
                                        <div className='flex gap-5 items-center'>
                                            {/* Select for attribute name */}
                                            <Select
                                                placeholder="Select Attribute"
                                                labelPlacement="outside"
                                                variant='flat'
                                                classNames={{
                                                    trigger: "font font-black"
                                                }}
                                                onChange={(e) => changeSelect(e)}
                                            >
                                                {attributeData.map((animal) => (
                                                    <SelectItem key={animal.name} value={animal.name}>
                                                        {animal.name}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                            <Select
                                                items={valuedata?.options}
                                                variant='flat'
                                                isMultiline={true}
                                                selectionMode="multiple"
                                                placeholder="Values"
                                                classNames={{
                                                    trigger: "font py-[10px] font-black"
                                                }}
                                                onChange={handleSelectionChange}

                                                renderValue={(items) => {
                                                    return (
                                                        <div className="flex flex-wrap gap-2">
                                                            {items?.map((item) => (
                                                                <Chip key={item.textValue}>{item.textValue}</Chip>
                                                            ))}
                                                        </div>
                                                    );
                                                }}
                                            >
                                                {valuedata?.options?.map((value) => (
                                                    <SelectItem key={value.value} textValue={value.name}>
                                                        {value.value}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                            {/* Stock field */}
                                            <Input
                                                type="number"
                                                placeholder="Stock"
                                                labelPlacement="outside"
                                                classNames={{
                                                    input: 'font-[600] font-sans',
                                                }}
                                                value={valuedata?.stock}
                                                onChange={(e) => setvaluedata((prevData) => ({ ...prevData, stock: e.target.value }))}
                                            />

                                            {/* Plus button to add attribute to the table */}
                                            <Button isIconOnly color="warning" variant="light" onClick={() => addAttributeToTable(valuedata.stock)}>
                                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M12 5.66669V18.3334M5.66667 12H18.3333"
                                                        stroke="#000"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </Button>
                                        </div>

                                        <Table
                                            classNames={{
                                                base: "max-h-[120px] overflow-scroll  ",
                                                table: "min-h-[70px]",
                                            }}
                                            aria-label="Attribute Values Table"
                                        >
                                            <TableHeader>
                                                <TableColumn>VALUE</TableColumn>
                                                <TableColumn>STOCK</TableColumn>
                                                <TableColumn>ACTIONS</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                {tableData.map((attribute, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{attribute.values}</TableCell>
                                                        <TableCell>{attribute.stock}</TableCell>
                                                        <TableCell className='flex gap-4'>
                                                            {/* Edit and delete buttons for each row */}

                                                            <span
                                                                className="text-lg text-danger cursor-pointer active:opacity-50  inline-block"
                                                                onClick={() => removeAttributeFromTable(index)}
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
                                    </div>
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
                            <Tab key="product-details" title="ProductDetails">
                                <Card className='p-5 gap-2'>
                                    <div className='mb-8'>
                                        <Select
                                            items={tagsData}
                                            label="Tags"
                                            variant="flat"
                                            isMultiline={true}
                                            selectionMode="multiple"
                                            placeholder="Select a Tags"
                                            labelPlacement="outside"
                                            classNames={{
                                                base: "max-w-xs font-sans font-black",
                                                trigger: "min-h-unit-12 py-2 font font-black",
                                            }}
                                            onChange={handletagsSelectionChange}
                                            renderValue={(items) => {
                                                return (
                                                    <div className="flex flex-wrap gap-2">
                                                        {items.map((item) => (
                                                            <Chip
                                                                variant="shadow"
                                                                classNames={{
                                                                    base: "bg-[#000] ",
                                                                    content: "text-white font-sans",
                                                                }}
                                                                key={item.key}>{item.data.name}
                                                            </Chip>
                                                        ))}
                                                    </div>
                                                );
                                            }}
                                        >
                                            {(tag) => (
                                                <SelectItem key={tag.name} textValue={tag.name}>
                                                    <span className="font-sans font-semibold">{tag.name}</span>
                                                </SelectItem>
                                            )}
                                        </Select>
                                    </div>
                                    <h1 className='font-sans font-semibold px-1 '>Highlights For Product</h1>
                                    <div className='flex gap-7 items-center justify-center max-w-xl'>
                                        <Select
                                            items={tagsData}
                                            variant="flat"
                                            placeholder="Select a Highlight"
                                            labelPlacement="outside"
                                            classNames={{
                                                base: "max-w-xs font-sans font-black",
                                                trigger: "min-h-unit-12 py-2 font-sans",
                                            }}
                                            key={selectedTag}
                                            onChange={handleSelectedTagChange}
                                        >
                                            {(tag) => (
                                                <SelectItem key={tag.name} textValue={tag.name}>
                                                    <span className="font-sans font-semibold">{tag.name}</span>
                                                </SelectItem>
                                            )}
                                        </Select>
                                        <Input
                                            type="text"
                                            placeholder="Highlight Value"
                                            labelPlacement="outside"
                                            value={inputValue}
                                            classNames={{
                                                label: "font-seminbold  font-sans",
                                                input: "font-[300]  font-sans",
                                            }}
                                            onChange={(e) => handleInputValueChange(e)}
                                        />
                                        <Button isIconOnly color="warning" variant="light" onClick={handlePlusButtonClick} >
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
                                    <Table
                                        classNames={{
                                            base: "max-h-[120px] max-w-[700px] border rounded-[14px] overflow-scroll",
                                            table: "min-h-[70px]",
                                            th: "text-center",
                                            tr: "text-center",
                                            td: "font-sans font-bold"

                                        }}
                                        aria-label="Attribute Values Table"
                                    >
                                        <TableHeader>
                                            <TableColumn>HIGHLIGHT</TableColumn>
                                            <TableColumn>VALUE</TableColumn>
                                            <TableColumn>ACTION</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            {highlightsValuesTable.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{row.highlight}</TableCell>
                                                    <TableCell>{row.value}</TableCell>
                                                    <TableCell>
                                                        <span
                                                            className="text-lg text-danger cursor-pointer active:opacity-50 flex justify-center items-center"
                                                            onClick={() => handleDeleteRow(index)}
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
        </div >
    )
}

export default ProductsForm
