import React, { useState } from 'react';
import Select from 'react-select';



export default function MultiSelect({categoriesData}) {
    const [selectedOption, setSelectedOption] = useState(null);
    
    const options = categoriesData.map(category => ({
      value: category.name,
      label: category.name
    }));
    
  return (
    <div className="App">
      <Select
      className='w-full'
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={options}
        isMulti
      />
    </div>
  );
}
