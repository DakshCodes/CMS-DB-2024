import React from 'react'
import Heading from '../../components/ui/Heading'
import { Input, Button, Tabs, Tab, Card } from "@nextui-org/react";
import Selected from '../../components/ui/Select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ProductsForm = () => {

    const [value, setValue] = React.useState('');

    let tabs = [
        {
            id: "photos",
            label: "Photos",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            id: "music",
            label: "Music",
            content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
        },
        {
            id: "videos",
            label: "Videos",
            content: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }
    ];

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-8 p-8 pt-6">
                <div className="flex items-center justify-between border-b  pb-3 ">
                    <Heading title={"Create Products"} description={"Add a new Prouduct"} />
                </div>
                <form className="space-y-8 w-full">
                    <div className="flex w-full flex-col ">
                        <Input
                            type="name"
                            label="Name"
                            variant='underlined'
                            labelPlacement={'outside'}
                            className="font font-bold w-full"
                            placeholder="Product Name"
                        />

                        <div className='mt-4'>

                            <ReactQuill
                                theme="snow"
                                value={value}
                                onChange={setValue}
                            />

                        </div>

                        {value}

                        <Tabs aria-label="Options" color={'primary'} className="font-sans font-bold mt-10" variant="bordered">
                            <Tab key="photos" title="Genral" >
                                <Card className='px-5 py-4  gap-5 flex-row items-center'>
                                    <div className='flex gap-3'>
                                        <Input
                                            type="number"
                                            label="Regular price"
                                            placeholder="0.00"
                                            labelPlacement="inside"
                                            className="font font-semibold w-[10rem]"
                                            startContent={
                                                <div className="pointer-events-none flex items-center">
                                                    <span className="text-default-400 text-small">₹</span>
                                                </div>
                                            }
                                        />
                                        <Input
                                            type="number"
                                            label="Sale price"
                                            placeholder="0.00"
                                            labelPlacement="inside"
                                            className="font font-semibold w-[10rem]"
                                            startContent={
                                                <div className="pointer-events-none flex items-center">
                                                    <span className="text-default-400 text-small">₹</span>
                                                </div>
                                            }
                                        />
                                    </div>
                                    <div className='flex gap-3'>
                                        <Selected title={"Tax status"} />
                                        <Selected title={"Tax class"} />
                                    </div>
                                </Card>
                            </Tab>
                            <Tab key="music" title="Attributes">
                                <Card>
                                    hey
                                </Card>
                            </Tab>
                        </Tabs>

                        <div className='mt-4'>

                            <ReactQuill
                                theme="snow"
                                value={value}
                                onChange={setValue}
                            />
                            
                        </div>
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
