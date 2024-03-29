import React from 'react'
import { Select, SelectItem } from "@nextui-org/react";

const Selected = ({title}) => {

    const animals = [
        { label: "Cat", value: "cat", description: "The second most popular pet in the world" },
        { label: "Dog", value: "dog", description: "The most popular pet in the world" },
        { label: "Elephant", value: "elephant", description: "The largest land animal" },
        { label: "Lion", value: "lion", description: "The king of the jungle" },
        { label: "Tiger", value: "tiger", description: "The largest cat species" },
        { label: "Giraffe", value: "giraffe", description: "The tallest land animal" },
        {
            label: "Dolphin",
            value: "dolphin",
            description: "A widely distributed and diverse group of aquatic mammals",
        },
        { label: "Penguin", value: "penguin", description: "A group of aquatic flightless birds" },
        { label: "Zebra", value: "zebra", description: "A several species of African equids" },
        {
            label: "Shark",
            value: "shark",
            description: "A group of elasmobranch fish characterized by a cartilaginous skeleton",
        },
        {
            label: "Whale",
            value: "whale",
            description: "Diverse group of fully aquatic placental marine mammals",
        },
        { label: "Otter", value: "otter", description: "A carnivorous mammal in the subfamily Lutrinae" },
        { label: "Crocodile", value: "crocodile", description: "A large semiaquatic reptile" },
    ];
    return (
        <div key={"faded"} className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Select
                variant={"flat"}
                label={title}
                className="font font-semibold  w-[13rem]"
            >
                {animals.map((animal) => (
                    <SelectItem key={animal.value} value={animal.value}>
                        {animal.label}
                    </SelectItem>
                ))}
            </Select>
        </div>
    )
}

export default Selected
