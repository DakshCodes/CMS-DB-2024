import React from 'react'
import { Link } from 'react-router-dom'
import DataTable from '../../components/DataTable/DataTable'
import Butoon from '../../components/ui/Butoon'
import Heading from '../../components/ui/Heading'

const Sizes = () => {
    return (
        <>
            <div className="flex items-center justify-between  border-b mx-4 md:mx-10 pb-3 py-5">
                <div className="flex-1 ">
                    <Heading title={`Sizes (0)`} description="Manage Sizes for your store" />
                </div>
                <Link to={'/sizes/new'}>
                    <Butoon title={"Add New"} />
                </Link>
            </div >
            <DataTable />
        </>
    )
}

export default Sizes
