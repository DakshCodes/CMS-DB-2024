import React from 'react'
import Input from '../ui/Input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table'

const DataTable = () => {
    return (
        <div className='mx-10'>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search"
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                
            </div>
        </div >
    )
}

export default DataTable
