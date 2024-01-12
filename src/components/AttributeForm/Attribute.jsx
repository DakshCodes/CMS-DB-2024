
import React, { useEffect, useState } from 'react';
import {
    Input,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Select,
    SelectItem,
    Card,
    Chip,
} from '@nextui-org/react';
import toast from 'react-hot-toast';
import { SetLoader } from '../../redux/loadersSlice';
import { GetAttributeData } from '../../apicalls/attributes';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AttributeForm = ({ setFormValues }) => {
    const [attributeData, setAttributeData] = useState([]);
    const [selectedAttribute, setSelectedAttribute] = useState(null);
    const [selectedValues, setSelectedValues] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [stockValue, setStockValue] = useState('');
    const [mainstockTable, setMainstockTable] = useState([]);
    const [valuedata, setvaluedata] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        getAttributeData();
    }, []);

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

    const changeSelect = (e) => {
        const selectedAttributeName = e.target.value;
        const selectedAttributeOne = attributeData.find((attribute) => attribute.name === selectedAttributeName);
        setvaluedata(selectedAttributeOne);
        setSelectedAttribute(selectedAttributeOne);
    };

    const handleSelectionChange = (e) => {
        setSelectedValues(e.target.value.split(','));
    };

    const addAttributeToTable = () => {
        if (selectedAttribute && selectedValues.length > 0) {
            const newTableData = selectedValues.map((value) => ({
                value1: value,
                value2: "",
                stock: "",
                sku: ""
            }));

            // If there are existing items in the table, update value2 for the corresponding items
            if (tableData.length > 0) {

                if (selectedValues.length === 1) {
                    const updatedTableData = tableData.map((item) => ({
                        ...item,
                        value2: selectedValues[0]
                    }));
                    setTableData(updatedTableData);
                }
                else {
                    const updatedTableData = tableData.map((item, index) => {
                        if (index < selectedValues.length) {
                            return {
                                ...item,
                                value2: selectedValues[index]
                            };
                        }
                        return item;
                    });
                    setTableData(updatedTableData);
                }
            } else {
                setTableData(newTableData);
            }

            setSelectedValues([]);
            setSelectedAttribute(null);
        }
    };

    const removeAttributeFromTable = (index) => {
        const newTableData = [...tableData];
        newTableData.splice(index, 1);
        setTableData(newTableData);
    };

    const handleStockAddTable = () => {
        setTableData([...tableData, { stock: stockValue }]);
        setStockValue('');
    };
    const addStockMain = () => {
        if (tableData.length > 0) {
            // Save the previous value of mainstockTable
            const previousMainstockTable = [...mainstockTable];

            // Append the current value of tableData to mainstockTable
            setMainstockTable([...mainstockTable, ...tableData]);

            // Now you can use previousMainstockTable if needed
            // For example, console.log(previousMainstockTable);

            setFormValues((prevValues) => ({
                ...prevValues,
                attributes: [...mainstockTable, ...tableData],
            }));
            setTableData([]);
        }
    };


    const removeStockFromTable = (index) => {
        const newMainstockTable = [...mainstockTable];
        newMainstockTable.splice(index, 1);
        setMainstockTable(newMainstockTable);
    };

    // stock
    const handleStockChange = (index, value) => {
        const updatedTableData = tableData.map((item, i) => {
            if (i === index) {
                return {
                    ...item,
                    stock: value,
                    sku: item.value1.split("")[0] + item.value2.split("")[0] + Math.random().toPrecision().split("")[2] + Math.random().toPrecision().split("")[2] + Math.random().toPrecision().split("")[2] + Math.random().toPrecision().split("")[2] + Math.random().toPrecision().split("")[2]
                };
            }
            return item;
        });
        setTableData(updatedTableData);
    };

    // console.log(tableData)
    console.log(mainstockTable, "main")

    return (
        <>
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
                            <TableColumn>VALUE1</TableColumn>
                            <TableColumn>VALUE2</TableColumn>
                            <TableColumn>STOCKS</TableColumn>
                            <TableColumn>ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {tableData.map((object, index) => (
                                <TableRow key={index}>
                                    <TableCell>{object.value1}</TableCell>
                                    <TableCell>{object.value2}</TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            labelPlacement="outside"
                                            className='max-w-max'
                                            value={object.stock}
                                            onChange={(e) => handleStockChange(index, e.target.value)}
                                        />
                                    </TableCell>
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
                    <Button
                        isLoading={false}
                        onClick={addStockMain}
                        className='font-sans text-[#fff] bg-[#000] font-[600] w-[10rem] flex mt-[1rem]   justify-center items-center mx-auto'
                    >
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
                            <TableColumn>SKU</TableColumn>
                            <TableColumn>ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {mainstockTable.map((object, index) => (
                                <TableRow key={index}>
                                    {/* Display VALUES and STOCKS in each row */}
                                    <TableCell>{object.value1 + "+" + object.value2}</TableCell>
                                    <TableCell>{object.stock}</TableCell>
                                    <TableCell>{object.sku}</TableCell>
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
        </>
    )
}

export default AttributeForm
