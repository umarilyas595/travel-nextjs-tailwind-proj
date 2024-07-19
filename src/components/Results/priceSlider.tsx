import React,{useEffect} from 'react';
import Slider from '@mui/material/Slider';

function valuetext(value: number) {
  return `${value}°C`;
}

export default function RangeSlider({title,clearData}:any) {
  const [value, setValue] = React.useState<number[]>([500, 10000]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  useEffect(()=>{
if(clearData == true){
  setValue([500,10000])
}
  },[clearData])

  return (
    <div className="py-7 border-b border-[#E3E3E3]">
        <h1 className="text-[18px] font-bold">{title}</h1>
        <div className='my-5 font-semibold flex items-center justify-between'>
            <h1>{value ? `$${value[0]}` : "$0"}</h1>
            <h1>{value ? `$${value[1]}` : "$0"}</h1>
        </div>
      <Slider
        getAriaLabel={() => 'Temperature range'}
        value={value}
        onChange={handleChange}
        getAriaValueText={valuetext}
        min={500}
        max={10000}
      />
    </div>
  );
}