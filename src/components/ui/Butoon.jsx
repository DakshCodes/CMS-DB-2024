import React from 'react'

const Butoon = ({ title ,onOpen}) => {
    return (
        <button onClick={onOpen && onOpen} className="z-20 overflow-hidden  w-28 p-2 h-[2.5rem] bg-black text-white border-none rounded-md  font-bold cursor-pointer relative  group">
            <span className="absolute z-0 w-36 h-32 -top-8 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left" />
            <span className="absolute z-0 w-36 h-32 -top-8 -left-2 bg-purple-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left" />
            <span className="absolute z-0 w-36 h-32 -top-8 -left-2 bg-purple-600 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-left" />
            <svg className='h-6 w-6 absolute  left-1 top-2' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M12 6V18" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </g></svg>
            <span className=" z-20 absolute left-8 top-[0.6rem] text-[0.910rem]">{title}</span>
        </button>
    )
}

export default Butoon
