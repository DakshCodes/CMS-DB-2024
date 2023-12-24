import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import DataTable from '../../components/DataTable/DataTable'
import Butoon from '../../components/ui/Butoon'
import Heading from '../../components/ui/Heading'
import toast from 'react-hot-toast'
import { GetProductsData } from '../../apicalls/product'

const Products = () => {
    const [productsData , setProductsData] = React.useState([])

    const getProductsData  = async() =>{
        try {
            const response = await GetProductsData();

            if(response.success){
                setProductsData(response.products);
                toast.success(response.message);
            } else{
                throw new Error(response.message);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        getProductsData();
    },[]);

    const columns = [
        { name: "ID", uid: "_id", sortable: true },
        { name: "Product Name", uid: "productName" },
        { name: "Regular Price", uid: "regularPrice" },
        { name: "Sale Price", uid: "salePrice" },
        { name: "Created At", uid: "createdAt" },
        { name: "Actions", uid: "actions" },
    ];

    return (
        <>
            <div className="flex items-center justify-between  border-b mx-4 md:mx-10 pb-3 py-5">
                <div className="flex-1 ">
                    <Heading title={`Products (0)`} description="Manage Products for your store" />
                </div>
                <Link to={'/products/new'}>
                    <Butoon title={"Add New"} />
                </Link>
            </div >
            <DataTable data = {productsData} columns={columns}/>
        </>
    )
}

export default Products
