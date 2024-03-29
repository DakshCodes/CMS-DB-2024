import React from 'react'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Pagination,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,
} from "@nextui-org/react";
import { PlusIcon } from "../ui/PlusIcon";
import { VerticalDotsIcon } from "../ui/VerticalDotsIcon";
import { SearchIcon } from "../ui/SearchIcon";
import { useDispatch } from 'react-redux';
import { SetLoader } from "../../redux/loadersSlice";
import toast from 'react-hot-toast';
import moment from 'moment';





const DataTableModel = ({ data, columnss, update, deleteitem }) => {

    const [filterValue, setFilterValue] = React.useState("");
    const dispatch = useDispatch();
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "id",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);

    const pages = data ? Math.ceil(data.length / rowsPerPage) : 0;

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...data];
        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) => {
                return user?.name.toLowerCase().includes(filterValue.toLowerCase())
            });
        }
        return filteredUsers;
    }, [data, filterValue, statusFilter]);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);



    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = React.useCallback((user, columnKey, index) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "id":
                return (
                    <p
                        className='font-2 font-medium text-[#000]'
                    >
                        {user?._id}
                    </p>
                );
            case "mainHeading":
                return (
                    <p
                        className='font-2 font-medium text-[#000]'
                    >
                        {user?.mainHeading}
                    </p>
                );
            case "productsData.length":
                return (
                    <p
                        className='font-2 font-medium text-[#000]'
                    >
                        {user?.productsData.length}
                    </p>
                );


            case "name":
                return (
                    <p
                        className='font-2 font-medium text-[#000]'
                    >
                        {user?.name || user?.heading}
                    </p>
                );
            // case "overlayImages":
            //     return (
            //         <p
            //             className='font-2 font-medium text-[#000]'
            //         >
            //             {user?.overlayImages !== null ? "with overlay 3 image" :" Single Banner"}
            //         </p>
            //     );
            case "bannerImageLink":
                return (
                    <p
                    className='w-[5rem] h-[5rem] font-2 font-medium text-[#000]'
                >
                    <img className='w-full h-full rounded-lg object-cover' src={user?.bannerImageLink} alt="" />
                </p>
                );
            case "view":
                return (
                    <p
                        className='font-2 font-medium py-4 flex items-center justify-center text-[#000] max-w-max '
                    >
                        {user?.viewall}
                    </p>
                );
            case "isVisible":
                return (
                    <p
                        className='font-2  max-w-max font-medium py-4 flex items-center justify-center text-[#000]'
                    >
                        {user?.isVisible || user?.visible ?
                            <div className='bg-green-600 py-1 rounded-full text-white px-6 text-center w-fit '>
                                Visible
                            </div>
                            :
                            <div className='bg-orange-600 py-1 rounded-full text-white px-6 text-center w-fit '>
                                Not Visible
                            </div>
                        }
                    </p>
                );
            case "hoverImage":
                return (
                    <p
                        className='w-[5rem] h-[5rem] font-2 font-medium text-[#000]'
                    >
                        <img className='w-full h-full rounded-lg object-cover' src={user?.hoverImage} alt="" />
                    </p>
                );

            case "options":
                return (
                    <p
                        className='font-2 font-medium text-[#000]'
                    >
                        {
                            user?.options.map((item, index) => {
                                return <span key={index}>{item.value + " "}</span>
                            })
                        }
                    </p>
                );

            case "parentCategory":
                return (
                    <p
                        className='font-2 font-medium text-[#000]'
                    >
                        {user?.parentCategory ? user?.parentCategory.name : "No Parent Category"}
                    </p>
                );

            case "createdAt":
                return (
                    <div className="font-2 font-medium text-[#000] max-w-max ">
                        {moment(user?.createdAt).format("YYYY[/]MM[/]DD [at] LT")}
                    </div>
                );
            case "updatedAt":
                return (
                    <div className="font-2 font-medium text-[#000]">
                        {moment(user?.updatedAt).format("YYYY[/]MM[/]DD [at] LT")}
                    </div>
                );
            case "actions":
                return (
                    <div className="relative  w-[max-content] flex justify-start items-center gap-2">
                        <Dropdown className="bg-background border-1 border-default-200">
                            <DropdownTrigger aria-label="Dropdown menu">
                                <Button isIconOnly radius="full" size="sm" variant="light">
                                    <VerticalDotsIcon className="text-[#000]" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu className='font-2 font-medium text-[#000]'>
                                <DropdownItem aria-label="Edit" onClick={() => update(user._id)}>Edit</DropdownItem>
                                {
                                    !(user?.name == "Colors") ? (<DropdownItem aria-label="Delete" onClick={() => deleteitem(user._id)}>Delete</DropdownItem>) : ("You Can't Delete")
                                }
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);


    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className=" flex flex-col gap-4 my-5 ">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        classNames={{
                            base: "w-full sm:max-w-[44%] ",
                            inputWrapper: "font-2 font-bold ",
                        }}
                        placeholder="Search by name..."
                        size="sm"
                        startContent={<SearchIcon className="text-default-300" />}
                        value={filterValue}
                        variant="underlined"
                        onClear={() => setFilterValue("")}
                        onValueChange={onSearchChange}
                    />
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        onSearchChange,
        onRowsPerPageChange,
        data.length,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-10  flex justify-between items-center ">
                <Pagination
                    showControls
                    classNames={{
                        cursor: "bg-foreground text-background",
                    }}
                    color="default"
                    isDisabled={hasSearchFilter}
                    page={page}
                    total={pages}
                    variant="bordered"
                    onChange={setPage}
                />
            </div>
        );
    }, [items.length, page, pages, hasSearchFilter]);



    return (
        <>
            <Table
                isCompact
                removeWrapper
                aria-label="Example table with custom cells, pagination and sorting"
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    base: "max-w-[93rem] mx-auto overflow-scroll",
                    table: "min-w-[18rem]",
                }}
                selectedKeys={selectedKeys}
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={columnss}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                            allowsSorting={column.sortable}
                            className="font font-medium text-[#000]  max-w-max "
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody

                    emptyContent={"No users found"} items={sortedItems}>
                    {(item, index) => (
                        <TableRow key={item._id}  className="w-full"  >
                            {(columnKey) => <TableCell  >{renderCell(item, columnKey, index)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>

    );
}


export default DataTableModel;
