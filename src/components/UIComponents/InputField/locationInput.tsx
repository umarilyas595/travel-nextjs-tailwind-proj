import React,{useEffect,useState,useRef} from 'react'
import { Box, Typography } from "@mui/material";
import { useAppDispatch,useAppSelector } from '@/redux/hooks'

interface IInputField {
    className?: string,
    label: string,
    type?: string,
    value?: string
    placeholder?: string,
    icon?: any,
    onChange?: (value?: any) => void,
    onAdditionalChange?: (value?: any) => void,
    name?: string,
    styling?: any ,
    items?:[] | any,
    onFocus?:any,
    locationList?:any,
}

const InputWithSuggestion = ({className,name, label, type, placeholder="", onChange= (e)=>{}, icon,items,value,onFocus,locationList}: IInputField) => {
    const ref = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch()
    const wrapperRef = useRef<HTMLInputElement>(null);
    const [showDropDown, setShowDropDown] = useState(false);
    const [values,setValue] = useState<any>("")
    const [filteredArray, setFilteredArray] = useState([])

    useEffect(()=>{
        setFilteredArray(items)
    },[items])

    useEffect(() => {
        if(wrapperRef)
        {
            window.addEventListener('click', (e) => {
                if(wrapperRef.current)
                {
                    if(!wrapperRef.current.contains((e.target as Element)))
                    {
                        setShowDropDown(false)
                    }
                }
            })
        }
    }, [wrapperRef])

    useEffect(() => {
  if(showDropDown)
  {
      ref.current?.classList.remove('hidden')
      setTimeout(() => {
          ref.current?.classList.remove('opacity-0')
          ref.current?.classList.remove('-translate-y-5')
      }, 200);
  }
  else
  {
      ref.current?.classList.add('opacity-0')
      ref.current?.classList.add('-translate-y-5')
      setTimeout(() => {
          ref.current?.classList.add('hidden')
      }, 200);
  }
}, [showDropDown])
    return (
        <div className={`relative ${className}`}>
            <div ref={wrapperRef} className="relative">
                <div className="border border-[#C9D2DD] bg-white rounded-2xl py-4 px-5 flex items-center">
                    {
                        icon && <div className="mr-1">{icon}</div>
                    }
                    <input 
                        type={type ? type : 'text'} 
                        className={`outline-none w-full`} 
                        placeholder={placeholder ? placeholder : label} 
                        
                        onChange={(e) => {
                            onChange(e.target.value)
                            setValue(e.target.value)}}
                        value={value}
                        name={name}
                        autoComplete="off"
                        onFocus = {()=>{
                            onFocus()
                            setShowDropDown(!showDropDown)
                        }}
                    />
                </div>
                <div>
                    <Box
                        ref={ref}
                        className="sm:w-[300px] w-full overflow-x-hidden rounded-xl large-shadow hidden opacity-0 -translate-y-5 transition-all duration-300"
                            position="absolute"
                            left="0"
                            right="0"
                            bgcolor="common.white"
                            zIndex="3"
                    >
                        <Box className="relative">
                            <Box
                            className="max-h-[250px] h-auto"
                            py="10px"
                            sx={{ overflowY: "auto" }}
                            >
                                {filteredArray?.map((country:any, index:number) => {
                                    return (
                                    <Box
                                    className="w-full"
                                        key={index}
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        py="5px"
                                        pl="20px"
                                        sx={{
                                        cursor: "pointer",
                                        "&:hover": {
                                            bgcolor: "grey.200",
                                        },
                                        }}
                                        onClick={()=>{
                                            setValue(country.city)
                                            setShowDropDown(false)
                                            onChange(country.city)
                                        }}
                                    >
                                        <span className="text-[#9e9e9e] mr-2">{country.city}</span>
                                    </Box>
                                    );
                                })}
                            </Box>
                        </Box>
                    </Box>
                </div>
            </div>
            <div className="absolute top-[-0.5rem] left-0 w-full flex justify-center items-center">
                <label className="px-[5px] text-[11px] uppercase letter-spacing"
                style={{background: "linear-gradient(360deg, #fff, #fff, #fff, transparent, transparent)"}}
                >{label}</label>
            </div>
        </div>
    )

}

export default InputWithSuggestion