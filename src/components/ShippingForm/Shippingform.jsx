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
        shippingClass: '',
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

    const handleShippingClassChange = (e) => {
        const selectedShippingClass = e.target.value.split(",");
        setFormData({
            ...formData,
            shippingClass: selectedShippingClass,
        });
        setFormValues((prevValues) => ({
            ...prevValues,
            shipping: { ...prevValues.shipping, shippingClass: selectedShippingClass },
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
                <div className='flex flex-col gap-0 md:flex-row md:gap-10 justify-start  items-center'>
                    <h1 className='font-2 font-[500] text-[#9166d4]'>Shipping Class</h1>
                    <Select
                        // className="max-w-xs"
                        className="font-2 font-[400]  flex justify-center items-center max-w-xs"
                        placeholder='No shipping class'
                        // label="No shipping "
                        value={formData.shippingClass}
                        onChange={handleShippingClassChange}
                    >
                        <SelectItem
                            key="argentina"
                            startContent={<Avatar alt="Argentina" className="w-6 h-6" src="https://flagcdn.com/ar.svg" />}
                        >
                            Argentina
                        </SelectItem>
                        <SelectItem
                            key="venezuela"
                            startContent={<Avatar alt="Venezuela" className="w-6 h-6" src="https://flagcdn.com/ve.svg" />}
                        >
                            Venezuela
                        </SelectItem>
                        <SelectItem
                            key="brazil"
                            startContent={<Avatar alt="Brazil" className="w-6 h-6" src="https://flagcdn.com/br.svg" />}
                        >
                            Brazil
                        </SelectItem>
                        <SelectItem
                            key="switzerland"
                            startContent={
                                <Avatar alt="Switzerland" className="w-6 h-6" src="https://flagcdn.com/ch.svg" />
                            }
                        >
                            Switzerland
                        </SelectItem>
                        <SelectItem
                            key="germany"
                            startContent={<Avatar alt="Germany" className="w-6 h-6" src="https://flagcdn.com/de.svg" />}
                        >
                            Germany
                        </SelectItem>
                        <SelectItem
                            key="spain"
                            startContent={<Avatar alt="Spain" className="w-6 h-6" src="https://flagcdn.com/es.svg" />}
                        >
                            Spain
                        </SelectItem>
                        <SelectItem
                            key="france"
                            startContent={<Avatar alt="France" className="w-6 h-6" src="https://flagcdn.com/fr.svg" />}
                        >
                            France
                        </SelectItem>
                        <SelectItem
                            key="italy"
                            startContent={<Avatar alt="Italy" className="w-6 h-6" src="https://flagcdn.com/it.svg" />}
                        >
                            Italy
                        </SelectItem>
                        <SelectItem
                            key="mexico"
                            startContent={<Avatar alt="Mexico" className="w-6 h-6" src="https://flagcdn.com/mx.svg" />}
                        >
                            Mexico
                        </SelectItem>
                    </Select>
                </div>
            </Card>
        </div>
    )
}

export default Shippingform
