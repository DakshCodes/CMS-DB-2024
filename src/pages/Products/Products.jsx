import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import DataTable from '../../components/DataTable/DataTable'
import Butoon from '../../components/ui/Butoon'
import Heading from '../../components/ui/Heading'
import toast from 'react-hot-toast'
import { GetProductsData } from '../../apicalls/product'
import { useDispatch } from 'react-redux'
import { SetLoader } from "../../redux/loadersSlice";

const Products = () => {
   
    const [productsData , setProductsData] = React.useState([])
    const dispatch = useDispatch();

    const getProductsData  = async() =>{
        try {
            dispatch(SetLoader(true));
            const response = await GetProductsData();
            dispatch(SetLoader(false));
            if(response.success){
                setProductsData(response.products);
            } else{
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        getProductsData();
    },[]);

    
    const columns = [
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
                    <Heading title={`Products (${productsData.length})`} description="Manage Products for your store" />
                </div>
                <Link to={'/products/new'}>
                    <Butoon title={"Add New"} />
                </Link>
            </div >
            <DataTable data ={productsData} columnss={columns}/>
        </>
    )
}

export default Products
