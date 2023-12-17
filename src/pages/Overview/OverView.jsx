import React from 'react'
import Card from '../../components/ui/Card'
import Heading from '../../components/ui/Heading'

const OverView = () => {
  return (
    <div className="flex-col ">
      <div className="flex-1 border-b mx-10 pb-3  pt-5 mb-4">
        <Heading title="Dashboard" description="Overview of your store" />
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3  mx-10">
        <Card
          title={"Total Revenue"}
          numbers={"0.00"}
          svg2={<svg viewBox="0 0 24 24" className="h-5 w-5  my-6 self-start" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M12 20.75C11.8019 20.7474 11.6126 20.6676 11.4725 20.5275C11.3324 20.3874 11.2526 20.1981 11.25 20V4C11.25 3.80109 11.329 3.61032 11.4697 3.46967C11.6103 3.32902 11.8011 3.25 12 3.25C12.1989 3.25 12.3897 3.32902 12.5303 3.46967C12.671 3.61032 12.75 3.80109 12.75 4V20C12.7474 20.1981 12.6676 20.3874 12.5275 20.5275C12.3874 20.6676 12.1981 20.7474 12 20.75Z" fill="#000000" /> <path d="M13.5 18.75H7C6.80109 18.75 6.61032 18.671 6.46967 18.5303C6.32902 18.3897 6.25 18.1989 6.25 18C6.25 17.8011 6.32902 17.6103 6.46967 17.4697C6.61032 17.329 6.80109 17.25 7 17.25H13.5C14.1615 17.3089 14.8199 17.1064 15.3339 16.6859C15.8479 16.2653 16.1768 15.6601 16.25 15C16.1768 14.3399 15.8479 13.7347 15.3339 13.3141C14.8199 12.8935 14.1615 12.691 13.5 12.75H10.5C9.97449 12.7839 9.44746 12.7136 8.94915 12.5433C8.45085 12.373 7.99107 12.106 7.5962 11.7576C7.20134 11.4092 6.87915 10.9863 6.64814 10.513C6.41712 10.0398 6.28182 9.52562 6.25 8.99998C6.28182 8.47434 6.41712 7.96016 6.64814 7.48694C6.87915 7.01371 7.20134 6.59076 7.5962 6.24235C7.99107 5.89394 8.45085 5.62692 8.94915 5.45663C9.44746 5.28633 9.97449 5.21611 10.5 5.24998H16C16.1989 5.24998 16.3897 5.329 16.5303 5.46965C16.671 5.61031 16.75 5.80107 16.75 5.99998C16.75 6.1989 16.671 6.38966 16.5303 6.53031C16.3897 6.67097 16.1989 6.74998 16 6.74998H10.5C9.83846 6.69103 9.18013 6.89353 8.6661 7.3141C8.15206 7.73468 7.82321 8.33987 7.75 8.99998C7.82321 9.6601 8.15206 10.2653 8.6661 10.6859C9.18013 11.1064 9.83846 11.3089 10.5 11.25H13.5C14.0255 11.2161 14.5525 11.2863 15.0508 11.4566C15.5492 11.6269 16.0089 11.8939 16.4038 12.2423C16.7987 12.5908 17.1208 13.0137 17.3519 13.4869C17.5829 13.9602 17.7182 14.4743 17.75 15C17.7182 15.5256 17.5829 16.0398 17.3519 16.513C17.1208 16.9863 16.7987 17.4092 16.4038 17.7576C16.0089 18.106 15.5492 18.373 15.0508 18.5433C14.5525 18.7136 14.0255 18.7839 13.5 18.75Z" fill="#000000" /> </g></svg>}
          svg1={<svg className="h-[22px] w-[22px]"  version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <style type="text/css" dangerouslySetInnerHTML={{__html: " .st0{fill:#000000;} " }} /> <g> <path className="st0" d="M318.213,66.588h107.818L465.37,0H85.969L46.63,66.588h145.727c32.137,9.476,58.259,28.504,72.702,52.656 H85.969l-39.34,66.588h227.316c-13.482,45.473-65.618,79.365-127.924,79.365H68.313v60.013L288.818,512h96.012v-23.222 L183.333,321.936c84.557-3.351,153.634-61.218,166.283-136.105h76.415l39.339-66.588H345.687 C340.062,100.028,330.637,82.256,318.213,66.588z" /> </g> </g></svg>

}
        />
        <Card
          title={"Sales"}
          numbers={"0"}
          svg2={<svg viewBox="0 0 48 48" className="h-5 w-5  my-6 self-start" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth={5} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"><defs><style dangerouslySetInnerHTML={{ __html: ".a{fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;}" }} /></defs><rect className="a" x="4.5" y="9.5" width={39} height={29} rx={3} /><line className="a" x1="4.5" y1="16.5" x2="43.5" y2="16.5" /><line className="a" x1="33.5" y1="34.5" x2="33.5" y2="32.5" /><line className="a" x1="36.5" y1="34.5" x2="36.5" y2="32.5" /><line className="a" x1="39.5" y1="34.5" x2="39.5" y2="32.5" /></g></svg>}
          svg1={<svg viewBox="0 0 24 24" className="h-[30px] w-[30px]" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M12 6V18" stroke="#000000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </g></svg>}
        />
        <Card
          title={"Product In Stock"}
          numbers={"0"}
          svg2={<svg viewBox="0 0 24 24" className="h-5 w-5  my-6 self-start" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M21.9844 10C21.9473 8.68893 21.8226 7.85305 21.4026 7.13974C20.8052 6.12523 19.7294 5.56066 17.5777 4.43152L15.5777 3.38197C13.8221 2.46066 12.9443 2 12 2C11.0557 2 10.1779 2.46066 8.42229 3.38197L6.42229 4.43152C4.27063 5.56066 3.19479 6.12523 2.5974 7.13974C2 8.15425 2 9.41667 2 11.9415V12.0585C2 14.5833 2 15.8458 2.5974 16.8603C3.19479 17.8748 4.27063 18.4393 6.42229 19.5685L8.42229 20.618C10.1779 21.5393 11.0557 22 12 22C12.9443 22 13.8221 21.5393 15.5777 20.618L17.5777 19.5685C19.7294 18.4393 20.8052 17.8748 21.4026 16.8603C21.8226 16.1469 21.9473 15.3111 21.9844 14" stroke="#000" strokeWidth="1.5" strokeLinecap="round" /> <path d="M21 7.5L17 9.5M12 12L3 7.5M12 12V21.5M12 12C12 12 14.7426 10.6287 16.5 9.75C16.6953 9.65237 17 9.5 17 9.5M17 9.5V13M17 9.5L7.5 4.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" /> </g></svg>
          }
        />
      </div>
    </div >
  )
}

export default OverView
