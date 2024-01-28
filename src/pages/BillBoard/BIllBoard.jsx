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
import Multipletabs from '../../components/MultipleTab/MultipleTabs'
import Banner from '../Banner/Banner'
import CardComponent from '../../components/CardComponent/CardComponent'

const BIllBoard = () => {
    
    return (
        <>
            <div className="flex flex-col  items-start  justify-between  border-b mx-4 md:mx-10 pb-3 py-5 ">
                <Tabs aria-label="Options" className='font-semibold' color="primary" variant="underlined">
                    <Tab
                        key="banner"
                        className='w-full'
                        title={
                            <div className="flex items-center space-x-2">
                                {/* <GalleryIcon /> */}
                                <span><img className='w-[2rem]' src={BannerIcon} alt="" /></span>
                                <span>Banner</span>
                                <span>(10)</span>
                            </div>
                        }
                    >
                        <Banner />
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
                        className='w-full'
                        title={
                            <div className="flex items-center space-x-2">
                                <span><img className='w-[1.5rem]' src={CardIcon} alt="" /></span>
                                {/* <VideoIcon /> */}
                                <span>Card</span>
                                <span>(10)</span>

                            </div>
                        }
                    >
                        <CardComponent />
                    </Tab>
                    <Tab
                        className='w-full h-full '
                        key="multi_tabs"
                        title={
                            <div className="flex items-center space-x-2">
                                {/* <VideoIcon /> */}
                                <span><img className='w-[1.2rem]' src={TabsIcon} alt="" /></span>
                                <span>Multi Tabs</span>
                            </div>
                        }
                    >
                        <Multipletabs />
                    </Tab>
                </Tabs>
            </div >
        </>
    )
}

export default BIllBoard
