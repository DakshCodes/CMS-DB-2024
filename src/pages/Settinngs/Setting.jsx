import React from 'react'
import Heading from '../../components/ui/Heading'
import { Input, Button } from "@nextui-org/react";

const Setting = () => {

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-8 p-8 pt-6">
                <div className="flex items-center justify-between border-b  pb-3 ">
                    <Heading title={"Store Setting"} description={"Manage Store Preference"} />
                </div>
                <form className="space-y-8 w-full ">
                    <div className="md:grid md:grid-cols-1 gap-8">
                        <Input
                            type="name"
                            label="Name"
                            variant='underlined'
                            labelPlacement={'outside'}
                            className="font font-bold w-[20rem]"
                            placeholder="Name"
                        />
                        <Input
                            type="name"
                            label="Profile Picture"
                            variant='underlined'
                            labelPlacement={'outside'}
                            className="font font-bold w-[20rem]"
                            placeholder="Name"
                        />
                        <button className="font-sans w-[8rem]  inline-flex items-center  py-2 bg-[#fff] transition ease-in-out delay-75 hover:opacity-[0.8] text-[#000] text-[1rem] font-bold rounded-md hover:-translate-y-1 ">
                            <svg viewBox="0 0 512 512" className="h-4 w-4 mr-2 fill-[#000]"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg>
                            Log Out
                        </button>
                    </div>
                    <Button isLoading={false}  className="font-sans  mx-auto text-[#fff] bg-[#000] font-bold " type="submit">
                        Save Changes
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default Setting
