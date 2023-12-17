import React from 'react'

const Input = ({className}) => {
    return (
        <input
            className={
                `flex h-10 w-full font-bold rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-purple-600 file:border-0 file:bg-transparent file:text-sm file:font-bold placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`
            }
        />
    )
}

export default Input
