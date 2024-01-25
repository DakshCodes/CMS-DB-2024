import React from 'react'
import DataTable from '../../components/DataTable/DataTable'
import Butoon from '../../components/ui/Butoon'
import Heading from '../../components/ui/Heading'
import BannerIcon from "../../assets/banner.svg"
import SliderIcon from "../../assets/slider.svg"
import CardIcon from "../../assets/card.svg"
import TabsIcon from "../../assets/tabs.svg"
import LayoutIcon from "../../assets/layout.svg"
import { Card, Tab, Tabs } from '@nextui-org/react'
import ImageLayout from '../../components/ImgLayout/ImgLayout'
import SliderComponent from '../../components/SliderComponent/SliderComponent'

const BIllBoard = () => {
    const columns = [
        { name: "ID", uid: "id", sortable: true },
        { name: "NAME", uid: "name", },
        { name: "DATE", uid: "date" },
        { name: "ACTIONS", uid: "actions" },
    ];

    const users = [
        {
            id: 1,
            name: "Mens",
            date: "2023-13-12",
        },
        {
            id: 2,
            name: "Womens",
            date: "2021-10-12",
        },
    ];
    return (
        <>
            <div className="flex flex-col  items-start  justify-between  border-b mx-4 md:mx-10 pb-3 py-5 ">
                <Tabs aria-label="Options" className='font-semibold' color="primary" variant="underlined">
                    <Tab
                        key="banner"
                        title={
                            <div className="flex items-center space-x-2">
                                {/* <GalleryIcon /> */}
                                <span><img className='w-[2rem]' src={BannerIcon} alt="" /></span>
                                <span>Banner</span>
                                <span>(10)</span>
                            </div>
                        }
                    >
                        I am working on this
                    </Tab>
                    <Tab key="slider"
                        className='w-full h-full '
                        title={
                            <div className="flex items-center space-x-2">
                                {/* <MusicIcon /> */}
                                <span><img className='w-[1.5rem]' src={SliderIcon} alt="" /></span>
                                <span>Slider</span>

                            </div>
                        } >
                            <SliderComponent />
                        </Tab>
                    <Tab
                        className='w-full h-full '
                        key="img_layout"
                        title={
                            <div className="flex items-center space-x-2 ">
                                {/* <MusicIcon /> */}
                                <span><img className='w-[1.5rem]' src={LayoutIcon} alt="" /></span>
                                <span>Image Layout</span>
                            </div>
                        }>
                        <ImageLayout />
                    </Tab>
                    <Tab
                        key="card"
                        title={
                            <div className="flex items-center space-x-2">
                                <span><img className='w-[1.5rem]' src={CardIcon} alt="" /></span>
                                {/* <VideoIcon /> */}
                                <span>Card</span>
                                <span>(10)</span>

                            </div>
                        }
                    >
                        I am working on this
                    </Tab>
                    <Tab
                        key="multi_tabs"
                        title={
                            <div className="flex items-center space-x-2">
                                {/* <VideoIcon /> */}
                                <span><img className='w-[4rem]' src={TabsIcon} alt="" /></span>
                                <span>Multi Tabs</span>
                                <span>(10)</span>

                            </div>
                        }
                    />
                </Tabs>
            </div >
        </>
    )
}

export default BIllBoard
