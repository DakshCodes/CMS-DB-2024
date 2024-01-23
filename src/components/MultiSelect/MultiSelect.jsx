import React, { useEffect, useState } from 'react';
import Select from 'react-select';

export default function MultiSelect({ data, onSelectChange, type }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const updatedData = data.reduce((acc, item) => {
    if (item.parentCategory === null) {
      // Find all first children
      const firstChildren = data.filter(child => child.parentCategory?._id === item._id);

      // Add parent category and its first children to the accumulator
      if (firstChildren.length > 0) {
        firstChildren.forEach(firstChild => {
          acc.push({ value: firstChild._id, label: `${item.name} - ${firstChild.name}` });
        });
      } else {
        // If there are no first children, add only the parent category
        acc.push({ value: item._id, label: item.name || item.productName });
      }
    }
    return acc;
  }, []);
  const options = data?.map(elem => ({
    value: elem._id,
    label: elem.productName
  }));

  useEffect(() => {
    // Call the callback function with the selected values
    onSelectChange(selectedOption);
  }, [selectedOption, onSelectChange]);

  return (
    <div className="App">
      <Select
        className='w-[30rem]'
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={type ? updatedData : options}
        isMulti
      />
    </div>
  );
}
