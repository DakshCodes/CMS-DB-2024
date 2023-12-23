import React, { useState } from 'react'
import './DropDown.css'

const DropDown = ({ name }) => {

  return (
    <div className={`main-dropdown `}>
      <div className="header-logo">
        <h1 className='font font-black text-2xl '>
          PERMISSION
          {/* {name} */}
        </h1>
        {/* <img src={"https://i.pinimg.com/originals/41/f8/90/41f89016c529166a1cca6ec882665449.gif"} alt="" /> */}
      </div>
    </div>
  )
}

export default DropDown
