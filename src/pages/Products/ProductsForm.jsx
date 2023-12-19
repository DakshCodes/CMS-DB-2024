import React from 'react'
import Heading from '../../components/ui/Heading'
import { Input, Button } from "@nextui-org/react";

const ProductsForm = () => {
   
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-8 p-8 pt-6">
                <div className="flex items-center justify-between border-b  pb-3 ">
                    <Heading title={"Create Products"} description={"Add a new Prouduct"} />
                </div>
                <form className="space-y-8 w-full">
                    <div className="md:grid md:grid-cols-3 gap-8">
                        <Input
                            type="name"
                            label="Name"
                            variant='underlined'
                            labelPlacement={'outside'}
                            className="font font-bold"
                            placeholder="Product Name"
                        />
                    </div>
                    <Button isLoading={false} className="font-sans ml-auto text-[#fff] bg-[#000] font-medium" type="submit">
                        Create
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default ProductsForm
