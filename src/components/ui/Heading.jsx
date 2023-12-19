import React from 'react'

const Heading = ({ title,
    description }) => {
    return (
        <div>
            <h2 className="font-2 text-[2rem] font-black ">{title}</h2>
            <p className="font text-[1rem] font-medium opacity-[0.7] text-[#3c3c3c]">
                {description}
            </p>
        </div>
    )
}

export default Heading
