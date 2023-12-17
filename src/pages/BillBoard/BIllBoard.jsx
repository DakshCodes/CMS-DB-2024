import React from 'react'
import DataTable from '../../components/DataTable/DataTable'
import Butoon from '../../components/ui/Butoon'
import Heading from '../../components/ui/Heading'

const BIllBoard = () => {
    return (
        <>
            <div className="flex items-center justify-between  border-b mx-10 pb-3 py-5">
                <div className="flex-1 ">
                    <Heading title={`Billboards (0)`} description="Manage billboards for your store" />
                </div>
                <Butoon title={"Add New"} />
            </div >
            <DataTable />
        </>
    )
}

export default BIllBoard
