import React from 'react'

const Card = ({title,svg1,svg2,numbers}) => {
    return (
        <div className="shadow-[rgba(0,0,0,0.15)_1.95px_1.95px_2.6px]  rounded-lg  bg-card text-card-foreground  h-[110px] flex justify-between px-5 items-center">
            <div className="flex flex-col gap-1">
                <div className="font font-semibold text-lg ">
                 {title}
                </div>
                <div className="font-bold text-2xl  flex items-center w-[max-content]">
                    {svg1}
                    <span className='font'>{numbers}</span>
                </div>
            </div>
            {svg2}
        </div>
    )
}

export default Card
