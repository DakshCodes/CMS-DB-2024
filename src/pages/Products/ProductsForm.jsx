import React, { useRef, useState } from 'react';
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
import { GetHighlightData } from '../../apicalls/highlights';
import { GetCategoryData } from '../../apicalls/category';
import AttributeForm from '../../components/AttributeForm/Attribute';

const ProductsForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const [mainstockTable, setmainstockTable] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [valuedata, setvaluedata] = useState('');
    const [selectvalue, setselectvalue] = useState(new Set([]));
    const [selectedtags, setSelectedtags] = useState(new Set([]));
    const [selectedValues, setSelectedValues] = useState(new Set([]));
    const [selectedAttribute, setSelectedAttribute] = useState(null);
    const [stockValue, setStockValue] = useState('');
    const [Image, setImages] = useState('');
    const [ImageCombo, setImageCombo] = useState([]);
    const [ImgColor, setImgColor] = useState("");
    // State for selected tag
    const [selectedhighlight, setselectedhighlight] = useState(new Set([]));
    const [categoriesData, setCategoriesData] = useState([]);
    const [subCategoryData, setSubCategoryData] = useState([]);
    const [subSubCategoryData, setSubSubCategoryData] = useState([]);

    const [selectedMainCategory, setSelectedMainCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [selectedSubSubCategory, setSelectedSubSubCategory] = useState('');




    // State for input value
    const [inputValue, setInputValue] = useState('');

    // State for table values
    const [highlightsValuesTable, setHighlightsValuesTable] = useState([]);

    const productURL = params.id === 'new' ? null : params.id;

    const [imageLinks, setImageLinks] = React.useState([]);
    const [formValues, setFormValues] = React.useState({
        productName: '',
        regularPrice: '',
        salePrice: '',
        mainDescription: '',
        shortDescription: '',
        main_category: '',
        sub_category: '',
        sub_sub_category: '',
        product_images: [],
        attributes: [], // New field to store attributes array of objects
        producthighlights: [], // New field to store attributes array of objects
        tags: [], // New field to store tags array of objects
    });

    const { productName, regularPrice, salePrice, mainDescription, shortDescription, main_category, sub_category, sub_sub_category, product_images, attributes, producthighlights, tags } = formValues;


    React.useEffect(() => {
        const fetchProductDetails = async (id) => {
            try {
                dispatch(SetLoader(true));
                const response = await GetProductDataByID(id);
                dispatch(SetLoader(false));

                if (response.success) {
                    const productDetails = response.data;

                    // Update the product details and handle additional data as needed
                    const updatedProductDetails = {
                        ...productDetails,
                        attributes: productDetails.attributes || [], // Ensure attributes is an array
                        producthighlights: productDetails.producthighlights || [], // Ensure producthighlights is an array
                        tags: productDetails.tags || [], // Ensure tags is an array
                    };

                    // Set data in tables
                    setFormValues(updatedProductDetails);
                    setImageLinks(productDetails.product_images);
                    setmainstockTable(updatedProductDetails.attributes || []);
                    setHighlightsValuesTable(updatedProductDetails.producthighlights || []);
                    setSelectedtags(new Set(updatedProductDetails.tags || []));
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

    const [highlightsData, setHighlightsData] = useState([])

    const getHighlightsData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetHighlightData();
            dispatch(SetLoader(false));
            if (response.success) {
                setHighlightsData(response.highlight);
                console.log(highlightsData)
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            toast.error(error.message)
        }
    }

    const getCategoryData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetCategoryData();
            dispatch(SetLoader(false));
            if (response.success) {
                setCategoriesData(response.category);
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
        getTagsData();
        getHighlightsData();
        getCategoryData();
    }, [setTagsData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        formValues.main_category = selectedMainCategory;
        formValues.sub_category = selectedSubCategory;
        formValues.sub_sub_category = selectedSubSubCategory;


        formValues.tags = Array.from(selectedtags);
        formValues.product_images = ImageCombo;


        console.log(formValues);



        // Validate fields
        if (!validateFields(formValues)) {
            return;
        }

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
        const value = e.target.files[0];
        setImages(value);

    };

    const uploadImage = async (e) => {
        e.preventDefault();
        try {

            // Check Color empty
            if (!ImgColor) {
                toast.error('Please Add Color');
                return false;
            }

            // Check Imgae Src empty
            if (!Image) {
                toast.error('Please Add Image ?');
                return false;
            }

            dispatch(SetLoader(true));
            const formData = new FormData();
            formData.append('product_images', Image);
            const response = await UploadImage(formData);
            dispatch(SetLoader(false));

            if (response.success) {
                const newImageLink = response.url;
                setImageCombo([...ImageCombo, {
                    color: ImgColor,
                    src: newImageLink
                }]);
                setImages("")
                setImgColor("")
                toast.success(response.message);
            } else {
                console.log(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            console.log(error.message);
        }
    };


    const addAttributeToTable = () => {
        if (selectedAttribute) {
            // Add new row
            const newTableData = [
                ...tableData,
                selectvalue
            ];

            setTableData(newTableData);

            setselectvalue(null);
            setvaluedata('');
            setSelectedAttribute(null);
            setSelectedValues([])

        }
    };




    const removeAttributeFromTable = (index) => {
        const newTableData = [...tableData];
        newTableData.splice(index, 1);
        setTableData(newTableData);
    };

    const changeColor = (e) => {
        const selectColor = e.target.value;
        setImgColor(selectColor);
    };


    const dependentCategorySelection = (e) => {
        const selectedCategoryName = e.target.value;
        console.log("_____________________", selectedCategoryName)
        const filteredMainCategory = categoriesData.find((category) => category.name === selectedCategoryName);
        console.log(filteredMainCategory)
        setSubCategoryData(filteredMainCategory.subcategories);
    };


    const dependentSubCategrySelection = (e) => {
        const selectedSubCategoryName = e.target.value;
        console.log("_____________________", selectedSubCategoryName)
        const filteredSubCategory = subCategoryData.find((category) => category.name === selectedSubCategoryName);
        console.log(filteredSubCategory)
        setSubSubCategoryData(filteredSubCategory.items);
    };



    const handleSelectionChange = (e) => {
        // Check if there is a selected attribute
        if (selectedAttribute) {
            setSelectedValues(e.target.value.split(","));
            const selectedValues = e.target.value.split(",");
            setselectvalue({
                name: selectedAttribute.name,
                values: Array.from(selectedValues)
            });

        }
    };




    const handletagsSelectionChange = (e) => {
        setSelectedtags(e.target.value.split(","));
    };
    const handleSelectedHighlightChange = (e) => {
        setselectedhighlight(e.target.value)
    };


    // Function to handle input value change
    const handleInputValueChange = (event) => {
        setInputValue(event.target.value);
    };

    // Function to handle "plus" button click
    const handlePlusButtonClick = () => {
        if (selectedhighlight && inputValue) {
            // Create a new row object
            const newTableData = [
                ...highlightsValuesTable,
                {
                    highlight: selectedhighlight,
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
            setselectedhighlight(null);
            setInputValue('');
        }
    };

    // Function to handle row deletion
    const handleDeleteRow = (index) => {
        const updatedTable = [...highlightsValuesTable];
        updatedTable.splice(index, 1);
        setHighlightsValuesTable(updatedTable);
    };

    // stock add
    const handleStockAddTable = () => {
        setTableData([...tableData, { stock: stockValue }]);
        setStockValue('')
    };
    // inventory add
    const addstockmain = () => {
        if (tableData) {

            setmainstockTable((prevValues) => ([
                ...prevValues,
                tableData
            ]))
        }
        setTableData([]);
    };


    const removeStockFromTable = (index) => {
        const newTableData = [...mainstockTable];
        newTableData.splice(index, 1);
        setmainstockTable(newTableData);
    };


    // validation function

    const validateFields = (formValues) => {

        const { productName, regularPrice, salePrice, mainDescription, shortDescription, main_category, sub_category, sub_sub_category, product_images, attributes, producthighlights, tags } = formValues;

        // Check if Product Name is empty
        if (!productName) {
            toast.error('Please fill in the Product Name');
            return false;
        }

        // Check if Main Description is empty
        if (!mainDescription) {
            toast.error('Please fill in the Main Description');
            return false;
        }

        // Check if Regular Price is empty
        if (!regularPrice) {
            toast.error('Please fill in the Regular Price');
            return false;
        }

        // Check if Sale Price is empty
        if (!salePrice) {
            toast.error('Please fill in the Sale Price');
            return false;
        }

        // Check if Sale Price is empty
        if (!shortDescription) {
            toast.error('Please fill in the shortDescription');
            return false;
        }
        // Check if product_images is empty
        if (!product_images) {
            toast.error('Please fill in the product_images');
            return false;
        }

        // Check if Attributes array is empty
        if (!attributes || attributes.length === 0) {
            toast.error('Please fill in the Attributes');
            return false;
        }

        // Check if Product Highlights array is empty
        if (!producthighlights || producthighlights.length === 0) {
            toast.error('Please fill in the Product Highlights');
            return false;
        }

        // Check if Tags array is empty
        if (!tags || tags.length === 0 || !tags[0]) {
            toast.error('Please fill in the Tags');
            return false;
        }


        // Add similar checks for other fields

        return true;
    };


    const fileInputRef = useRef(null);

    const handleSelectPhoto = () => {
        fileInputRef.current.click();
    };


    console.log(ImageCombo, "images");


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
                                <AttributeForm setFormValues={setFormValues} />
                            </Tab>
                            <Tab key="image" title="Images">
                                <Card className='p-4 flex-row gap-5'>
                                    <Select
                                        placeholder="Select Color"
                                        labelPlacement="outside"
                                        variant='flat'
                                        classNames={{
                                            base: "max-w-[12rem] font-sans font-black",
                                            value: "font-sans font-[600]"
                                        }}
                                        onChange={(e) => changeColor(e)}
                                        defaultSelectedKeys={ImgColor}
                                    >
                                        {attributeData.map((animal) => (
                                            <SelectItem key={animal.name} value={animal.name}>
                                                {animal.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <Button color="primary"
                                        className='font-sans  font-[600]'
                                        endContent={<svg
                                            width={24}
                                            height={24}
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
                                        </svg>}
                                        onClick={handleSelectPhoto}
                                    >
                                        {!Image?.name > 0 ? "Select Image" : Image.type}
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
                                    <Button isLoading={false} className="font-sans ml-auto text-[#fff] bg-[#000] font-medium" onClick={uploadImage}>
                                        Upload
                                    </Button>

                                </Card>
                                <Card className={"p-4 mt-4 max-h-[50rem] overflow-scroll"}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 p-4 ">
                                        {ImageCombo && ImageCombo.length > 0 ? (
                                            ImageCombo.map((unitImage, index) => (
                                                <div key={index} className='w-[100%]  h-[100%] col-span-1'>
                                                    <h1 className='font-sans mx-5 font-bold'>{unitImage.color}</h1>
                                                    <img className='w-full h-full object-cover rounded-xl' src={unitImage.src} alt="" />
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
                                            selectedKeys={selectedtags}
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
                                            items={highlightsData}
                                            variant="flat"
                                            placeholder="Select a Highlight"
                                            labelPlacement="outside"
                                            classNames={{
                                                base: "max-w-xs font-sans font-black",
                                                trigger: "min-h-unit-12 py-2 font-sans",
                                            }}
                                            key={selectedhighlight}
                                            onChange={handleSelectedHighlightChange}
                                        >
                                            {(highlight) => (
                                                <SelectItem key={highlight.name} textValue={highlight.name}>
                                                    <span className="font-sans font-semibold">{highlight.name}</span>
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
                                            base: "max-h-[120px] max-w-[1000px] border rounded-[14px] overflow-scroll",
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

                            <Tab key={"product_category"} title="Categories">
                                <Card className='p-5 gap-2 w-full '>
                                    <div className='flex items-center gap-6 w-full '>
                                        <Select
                                            labelPlacement="inside"
                                            label="Select Main Category"
                                            variant='flat'
                                            classNames={{
                                                base: " font-sans font-black",
                                                trigger: "font font-black"
                                            }}
                                            onChange={(e) => {
                                                setSelectedMainCategory(e.target.value);
                                                dependentCategorySelection(e)
                                            }}
                                        >
                                            {categoriesData.map((category, index) => (
                                                <SelectItem key={category.name} textValue={category.name}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </Select>



                                        <Select
                                            items={subCategoryData}
                                            variant='flat'
                                            label="Select Sub Category"
                                            labelPlacement='inside'
                                            isMultiline={true}
                                            classNames={{
                                                base: " font-sans font-black",
                                                trigger: "font py-[10px] font-black"
                                            }}
                                            onChange={(e) => {
                                                setSelectedSubCategory(e.target.value);
                                                dependentSubCategrySelection(e)
                                            }}
                                        >
                                            {subCategoryData?.map((elem, index) => (
                                                <SelectItem key={elem?.name} textValue={elem.name} value={elem?.name}>
                                                    {elem.name}
                                                </SelectItem>
                                            ))}
                                        </Select>


                                        <Select
                                            items={subSubCategoryData}
                                            variant='flat'
                                            label="Select Sub Sub Category"
                                            labelPlacement='inside'
                                            isMultiline={true}
                                            // placeholder=""
                                            classNames={{
                                                base: " font-sans font-black",
                                                trigger: "font py-[10px] font-black"
                                            }}
                                            onChange={(e) => setSelectedSubSubCategory(e.target.value)}
                                        >
                                            {subSubCategoryData?.map((elem, index) => (
                                                <SelectItem key={elem} textValue={elem} value={elem}>
                                                    {elem}
                                                </SelectItem>
                                            ))}
                                        </Select>
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
            </div >
        </div >
    )
}

export default ProductsForm
