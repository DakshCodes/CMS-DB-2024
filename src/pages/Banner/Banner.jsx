import React from 'react'
import Heading from '../../components/ui/Heading'
import Butoon from '../../components/ui/Butoon'
import { useDisclosure } from '@nextui-org/react';
import DataTable from '../../components/DataTable/DataTable';
import BannerForm from './BannerForm';

const Banner = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const columns = [
        { name: "ID", uid: "id", sortable: true },
        { name: "NAME", uid: "name", },
        { name: "DATE", uid: "date" },
        { name: "ACTIONS", uid: "actions" },
    ];

    const users = [
        {
            id: 1,
            name: "Mens",
            date: "2023-13-12",
        },
        {
            id: 2,
            name: "Womens",
            date: "2021-10-12",
        },
    ];
    return (
        <>
            

            <div className=" w-full flex items-center justify-between  border-b pb-3 py-5">
                <div className="flex-1 ">
                    <Heading title={`Banners `} description="Manage banners for your landing page" />
                </div>
                <Butoon onOpen={onOpen} title={"Add New"} />
            </div >
            <BannerForm isOpen={isOpen} onOpenChange={onOpenChange} />
            {Array.isArray(users) && (
                <DataTable columnss={columns} data={users} />
            )}
        </>
    )
}

export default Banner
