import React,{useEffect} from 'react';
import Slider from '@mui/material/Slider';

function valuetext(value: number) {
  return `${value}°C`;
}

export default function RangeSlider({title,clearData,setRanking, value}:any) {
  const [valueRange, setValueRange] = React.useState<number[]>([1,5]);
  const [valueNum, setValue] = React.useState<number>(1);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setRanking(newValue)
    setValueRange([newValue,5] as number[]);
    if(typeof newValue == 'number')
    {
      setValue(newValue)
    }
  };

  useEffect(()=>{
    if(clearData == true){
      setValueRange([1,5])
    }
  },[clearData])

  useEffect(()=>{
    if(value == true){
      setValue(value)
      setValueRange([value,5] as number[]);
    }
  },[value])

  return (
    <div className="py-7 border-b border-[#E3E3E3]">
        <h1 className="text-[18px] font-bold">{title}</h1>
        <div className='my-5 font-semibold flex items-center justify-between'>
            <h1>{valueRange ? `$${valueRange[0]}` : "$0"}</h1>
            <h1>{valueRange ? `$${valueRange[1]}` : "$0"}</h1>
        </div>
      {/* <Slider
        // getAriaLabel={() => 'Temperature range'}
        value={value}
        onChange={handleChange}
        // getAriaValueText={valuetext}
        min={1}
        max={5}
        step = {0.1}
      /> */}
      <Slider
      value={valueNum}
       max={5} 
       min={1} 
       step = {0.1}
       onChange={handleChange}
       />
    </div>
  );
}