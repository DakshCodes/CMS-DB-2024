import React from 'react'
import Heading from '../../components/ui/Heading'
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Button } from "@nextui-org/react";
import OverviewChart from './OverviewChart';

const OverView = () => {
  return (
    <div className="flex-col ">
      <div className="flex-1 border-b mx-4 md:mx-10 pb-3  pt-5 mb-4">
        <Heading title="Dashboard" description="Overview of your store" />
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3  mx-4 md:mx-10">
        <Card className="max-w-[400px] px-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h1 className="text-sm font-bold">
              Total Revenue
            </h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground font-semibold">
              +20.1% from last month
            </p>
          </CardBody>
        </Card>
        <Card className="max-w-[400px] px-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h1 className="text-sm font-bold">
              Sales
            </h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground font-semibold">
              +19% from last month
            </p>
          </CardBody>
        </Card>
        <Card className="max-w-[400px] px-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h1 className="text-sm font-bold">
              Product In Stock
            </h1>
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted-foreground" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M21.9844 10C21.9473 8.68893 21.8226 7.85305 21.4026 7.13974C20.8052 6.12523 19.7294 5.56066 17.5777 4.43152L15.5777 3.38197C13.8221 2.46066 12.9443 2 12 2C11.0557 2 10.1779 2.46066 8.42229 3.38197L6.42229 4.43152C4.27063 5.56066 3.19479 6.12523 2.5974 7.13974C2 8.15425 2 9.41667 2 11.9415V12.0585C2 14.5833 2 15.8458 2.5974 16.8603C3.19479 17.8748 4.27063 18.4393 6.42229 19.5685L8.42229 20.618C10.1779 21.5393 11.0557 22 12 22C12.9443 22 13.8221 21.5393 15.5777 20.618L17.5777 19.5685C19.7294 18.4393 20.8052 17.8748 21.4026 16.8603C21.8226 16.1469 21.9473 15.3111 21.9844 14" stroke="#000" strokeWidth="1.5" strokeLinecap="round" /> <path d="M21 7.5L17 9.5M12 12L3 7.5M12 12V21.5M12 12C12 12 14.7426 10.6287 16.5 9.75C16.6953 9.65237 17 9.5 17 9.5M17 9.5V13M17 9.5L7.5 4.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" /> </g></svg>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="text-2xl font-bold">1082</div>
            <p className="text-xs font-semibold text-muted-foreground">
              All Categories
            </p>
          </CardBody>
        </Card>
      </div>
      <div className="mx-0 md:mx-10 mt-4 mr-0 md:mr-28 ">
        <Card className="col-span-4 w-full">
          <h1 className="font-sans text-lg mx-6 my-2 font-bold">
            Overview
          </h1>
          <CardBody className="pl-3 w-full">
            <OverviewChart />
          </CardBody>
        </Card>
      </div>
    </div >
  )
}

export default OverView
