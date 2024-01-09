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
import { GetHighlightData } from '../../apicalls/highlights';
import { GetCategoryData } from '../../apicalls/category';

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
                    console.log(productDetails, "details");

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
                console.log("-----------------------", response.category)
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
        formValues.attributes = mainstockTable;
        formValues.product_images = imageLinks;

        console.log(formValues)


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

    const changeSelect = (e) => {
        const selectedAttributeName = e.target.value;
        const selectedAttributeOne = attributeData.find((attribute) => attribute.name === selectedAttributeName);
        setvaluedata(selectedAttributeOne);
        setSelectedAttribute(selectedAttributeOne);
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

        // Check if Sale Price is empty
        if (!main_category) {
            toast.error('Please fill in the main_category');
            return false;
        }
        // Check if sub_category is empty
        if (!sub_category) {
            toast.error('Please fill in the sub_category');
            return false;
        }
        // Check if sub_category is empty
        if (!sub_sub_category) {
            toast.error('Please fill in the sub_sub_category');
            return false;
        }
        // Check if product_images is empty
        if (!product_images) {
            toast.error('Please fill in the product_images');
            return false;
        }
        // Check if sub_category is empty
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
                                <Card className=' py-6 flex flex-row justify-start max-w-max  overflow-scroll'>
                                    <div className='flex flex-col gap-6 max-w-max justify-center items-center'>
                                        <div className='flex gap-4 items-center justify-center px-4 w-[35rem]'>
                                            {/* Select for attribute name */}
                                            <Select
                                                placeholder="Select Attribute"
                                                labelPlacement="outside"
                                                variant='flat'
                                                classNames={{
                                                    base: "max-w-[12rem] font-sans font-black",
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
                                                    base: "max-w-[10rem] font-sans font-black",
                                                    trigger: "font py-[10px] font-black"
                                                }}
                                                selectedKeys={selectedValues}
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
                                            {/* Plus button to add attribute to the table */}
                                            <Button isIconOnly color="warning" variant="light" onClick={addAttributeToTable}>
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
                                                base: "max-h-[120px] max-w-[28rem] p-0 overflow-scroll  ",
                                                table: "min-h-[70px]",
                                            }}
                                            aria-label="Attribute Values Table"
                                        >
                                            <TableHeader>
                                                <TableColumn>NAME</TableColumn>
                                                <TableColumn>VALUES</TableColumn>
                                                <TableColumn>ACTIONS</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                {tableData.map((object, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{object.stock ? "Stock" : object.name}</TableCell>
                                                        <TableCell>{object.values ? object.values.join(', ') : object.stock}</TableCell>
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
                                        {/* Stock field */}
                                        <div className='flex flex-row items-center gap-5 self-start mx-20'>
                                            <Input
                                                type="number"
                                                placeholder="Stock"
                                                labelPlacement="outside"
                                                classNames={{
                                                    base: "max-w-[8rem] ",
                                                    input: 'font-[600] font-sans',
                                                }}
                                                value={stockValue}
                                                onChange={(e) => setStockValue(e.target.value)}
                                            />
                                            <Button isIconOnly color="warning" variant="light" onClick={handleStockAddTable}>
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
                                        <Button isLoading={false} onClick={addstockmain} className="font-sans text-[#fff] bg-[#000] font-[600] w-[10rem] flex mt-[1rem]   justify-center items-center mx-auto">
                                            Put Stock
                                            <svg className='h-7 w-7' viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M18.8832 4.69719C19.2737 4.30667 19.9069 4.30667 20.2974 4.69719L23.888 8.28778L27.469 4.7068C27.8595 4.31628 28.4927 4.31628 28.8832 4.7068C29.2737 5.09733 29.2737 5.73049 28.8832 6.12102L25.3022 9.702L28.7827 13.1825C29.1732 13.573 29.1732 14.2062 28.7827 14.5967C28.3922 14.9872 27.759 14.9872 27.3685 14.5967L23.888 11.1162L20.3979 14.6063C20.0074 14.9968 19.3743 14.9968 18.9837 14.6063C18.5932 14.2158 18.5932 13.5826 18.9837 13.1921L22.4738 9.702L18.8832 6.1114C18.4927 5.72088 18.4927 5.08771 18.8832 4.69719Z" fill="#fff" /> <path fillRule="evenodd" clipRule="evenodd" d="M23.86 15.0513C24.0652 14.9829 24.2871 14.9829 24.4923 15.0513L39.2705 19.9765C39.4691 20.0336 39.6499 20.1521 39.783 20.323L43.7861 25.4612C43.9857 25.7173 44.0485 26.0544 43.9545 26.3652C43.8902 26.5779 43.7579 26.7602 43.5821 26.887L28.1827 32.0159L24.965 27.8858C24.7754 27.6424 24.4839 27.5001 24.1753 27.5004C23.8667 27.5007 23.5755 27.6434 23.3863 27.8871L20.186 32.0093L4.74236 26.8577C4.58577 26.7329 4.46805 26.5621 4.40853 26.3652C4.31456 26.0544 4.37733 25.7173 4.57688 25.4612L8.50799 20.4154C8.62826 20.2191 8.81554 20.0652 9.04466 19.9889L23.86 15.0513ZM35.8287 20.9376L24.1802 24.8197L12.5277 20.9362L24.1762 17.0541L35.8287 20.9376Z" fill="#fff" /> <path d="M28.1442 34.1368L39.991 30.1911L39.9905 36.7628C39.9905 38.054 39.1642 39.2003 37.9392 39.6086L25.1762 43.863V31.4111L27.0393 33.8026C27.2997 34.1368 27.7423 34.2706 28.1442 34.1368Z" fill="#fff" /> <path d="M23.1762 31.4191V43.863L10.4131 39.6086C9.18811 39.2003 8.36183 38.054 8.36175 36.7628L8.36132 30.1732L20.2251 34.1306C20.6277 34.2649 21.0712 34.1305 21.3314 33.7953L23.1762 31.4191Z" fill="#fff" /> </g></svg>
                                        </Button>
                                    </div>
                                    <div>
                                        <h1 className='font-sans font-bold mx-auto max-w-max'>Main Stock Table</h1>
                                        <Table
                                            classNames={{
                                                base: "max-h-[120px] w-[40rem] mx-10 overflow-scroll  ",
                                                table: "min-h-[70px]",
                                            }}
                                            aria-label="Attribute Values Table"
                                        >
                                            <TableHeader>
                                                <TableColumn>VALUES</TableColumn>
                                                <TableColumn>STOCKS</TableColumn>
                                                <TableColumn>ACTIONS</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                {mainstockTable.map((innerArray, index) => (
                                                    <TableRow key={index}>
                                                        {/* Display VALUES and STOCKS in each row */}
                                                        <TableCell>{innerArray.map(item => item.values).flat().join(', ')}</TableCell>
                                                        <TableCell>{innerArray.map(item => item.stock)}</TableCell>
                                                        <TableCell className='flex gap-4'>
                                                            {/* Edit and delete buttons for each row */}

                                                            <span
                                                                className="text-lg text-danger cursor-pointer active:opacity-50  inline-block"
                                                                onClick={() => removeStockFromTable(index)}
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
