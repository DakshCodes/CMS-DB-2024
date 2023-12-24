import React from 'react'
import { Link } from 'react-router-dom'
import DataTable from '../../components/DataTable/DataTable'
import Butoon from '../../components/ui/Butoon'
import Heading from '../../components/ui/Heading'

const Orders = () => {
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
            <div className="flex items-center justify-between  border-b mx-4 md:mx-10 pb-3 py-5">
                <div className="flex-1 ">
                    <Heading title={`Orders (0)`} description="Manage Orders for your store" />
                </div>
            </div >
            <DataTable data={users} columnss={columns} />
        </>
    )
}

export default Orders
