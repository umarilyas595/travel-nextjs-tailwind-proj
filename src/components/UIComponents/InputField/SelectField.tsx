import { ISelectField, ISelectOptions } from '@/interfaces/input'
import React, { useEffect, useRef, useState } from 'react'

const SelectField = ({className,styling, label, data=[], value, placeholder, icon, onChange= (val)=>{}, onAdditionalChange = (val) => {}}: ISelectField) => {

    const [openDropDown, setOpenDropDown] = useState(false)
    const selectRef = useRef<HTMLDivElement | null>(null)
    const dropDownRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if(selectRef)
        {
            window.addEventListener('click', (e) => {
                if(selectRef.current)
                {
                    // console.log('window event',selectRef.current.contains((e.target as Element)))
                    if(!selectRef.current.contains((e.target as Element)))
                    {
                        setOpenDropDown(false)
                    }
                }
            })
        }
    }, [])

    useEffect(() => {
        if(openDropDown)
        {
            dropDownRef.current?.classList.remove('hidden')
            setTimeout(() => {
                dropDownRef.current?.classList.remove('opacity-0')
                dropDownRef.current?.classList.remove('-translate-y-5')
            }, 100);
        }
        else
        {
            dropDownRef.current?.classList.add('opacity-0')
            dropDownRef.current?.classList.add('-translate-y-5')
            setTimeout(() => {
                dropDownRef.current?.classList.add('hidden')
            }, 200);
        }
    }, [openDropDown])

    return (
        <div ref={selectRef} className={`relative cursor-pointer select-none ${className}`}>
            <div className="relative">
                <span className="border border-[#C9D2DD] bg-white rounded-2xl py-4 px-5 flex items-center justify-center relative"
                onClick={() => setOpenDropDown(!openDropDown)}
                >
                    <div className='flex items-center justify-center w-full'>
                    {
                        icon && <span className="mr-2">{icon}</span>
                    }
                    <span className={`${value ? 'text-black' : `text-[var(--lite-gray)]`} overflow-ellipsis overflow-hidden whitespace-nowrap`}>
                        {/* <input type="text" className='border-none outline-none h-full w-full' value={inputVal} placeholder={placeholder} /> */}
                        {value != "" ? value : placeholder}
                    </span>
                    </div>
                    <span className="ml-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </span>
                </span>
            <div className="absolute top-[-0.5rem] left-0 w-full flex justify-center items-center">
            <label className="px-[5px] text-[11px] uppercase letter-spacing"
            style={{background: "linear-gradient(360deg, #fff, #fff, #fff, transparent, transparent)"}}
            >{label}</label>
            </div>
            </div>

            <div ref={dropDownRef} className={`hidden opacity-0 absolute min-w-[250px] w-full bg-white border-gray-100 rounded-xl large-shadow overflow-hidden large-shadow z-20 transition-all duration-300 ${styling?.shadow ? styling.shadow : ""} ${styling?.top ? styling.top : "top-[50px]"}`}>
                <ul className={`list-none overflow-auto w-full ${styling?.dropdownHeight ? styling.dropdownHeight : "max-h-[300px]"}`}>
                    {
                        data.map((d: ISelectOptions, i: number) => {
                            return <li key={i} className={`text-center px-3 py-2 flex justify-center w-full cursor-pointer hover:bg-gray-50 ${value === d.name ? 'bg-[var(--dim-gray)]' : ''}`}
                            onClick={(e) => {
                                e.preventDefault()
                                setOpenDropDown(false)
                                onChange(d.name)
                            }}
                            >{d.name}</li>
                        })
                    }
                </ul>
            </div>
        </div>
    )

}

export default SelectField