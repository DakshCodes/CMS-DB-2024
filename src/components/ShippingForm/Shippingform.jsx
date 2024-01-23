import { Avatar, Card, Input, Select, SelectItem } from '@nextui-org/react'
import React, { useState } from 'react'

const Shippingform = ({ setFormValues }) => {
    const [formData, setFormData] = useState({
        weight: "",
        dimensions: {
            length: "",
            width: "",
            height: "",
        },
    });

    const handleWeightChange = (event) => {
        setFormData({
            ...formData,
            weight: event.target.value,
        });
        setFormValues((prevValues) => ({
            ...prevValues,
            shipping: { ...prevValues.shipping, weight: event.target.value },
        }));
    };

    const handleDimensionsChange = (field, value) => {
        setFormData({
            ...formData,
            dimensions: {
                ...formData.dimensions,
                [field]: value,
            },
        });
        setFormValues((prevValues) => ({
            ...prevValues,
            shipping: { ...prevValues.shipping, dimensions: { ...prevValues.shipping.dimensions, [field]: value } },
        }));
    };



    console.log(formData, "data")
    return (
        <div>
            <Card className='px-6 py-4 flex gap-5 justify-start max-w-max  overflow-scroll h-max'>
                <div className='flex flex-col gap-0 md:flex-row md:gap-16  justify-start flex-wrap items-center'>
                    <h1 className='font-2 max-w-max font-[500] text-[#9166d4]'>Weight (gm)</h1>
                    <Input
                        type="number"
                        placeholder="0"
                        variant='underlined'
                        className="font-2 font-black max-w-max flex justify-center items-center"
                        value={formData.weight}
                        onChange={handleWeightChange}
                    />
                </div>
                <div className='flex flex-col gap-0 md:flex-row md:gap-10 justify-start  items-center  '>
                    <h1 className='font-2 font-[500] text-[#9166d4]'>Dimensions (cm)</h1>
                    <Input
                        type="number"
                        variant='underlined'
                        placeholder="Length"
                        className="font-2 font-black max-w-max flex justify-center items-center"
                        value={formData.dimensions.length}
                        onChange={(e) => handleDimensionsChange('length', e.target.value)}
                    />
                    <Input
                        type="number"
                        variant='underlined'
                        placeholder="Width"
                        className="font-2 font-black max-w-max flex justify-center items-center"
                        value={formData.dimensions.width}
                        onChange={(e) => handleDimensionsChange('width', e.target.value)}
                    />
                    <Input
                        type="number"
                        variant='underlined'
                        placeholder="Height"
                        className="font-2 font-black max-w-max flex justify-center items-center"
                        value={formData.dimensions.height}
                        onChange={(e) => handleDimensionsChange('height', e.target.value)}
                    />
                </div>
            </Card>
        </div>
    )
}

export default Shippingform
