import React, { useEffect, useState } from 'react';
import Select from 'react-select';

export default function MultiSelect({ data, onSelectChange }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = data?.map(elem => ({
    value: elem._id,
    label: elem.name || elem.productName
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
        options={options}
        isMulti
      />
    </div>
  );
}
