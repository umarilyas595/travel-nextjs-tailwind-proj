import { IInputField } from '@/interfaces'
import React from 'react'

const InputField = ({className,name, label, type, value="", placeholder="", onChange= (e)=>{}, icon}: IInputField) => {

    return (
        <div className={`relative ${className}`}>
            <div className="relative">
                <div className="border border-[#C9D2DD] bg-white rounded-2xl py-4 px-5 flex items-center">
                    {
                        icon && <div className="mr-1">{icon}</div>
                    }
                    <input 
                        type={type ? type : 'text'} 
                        className={`outline-none w-full`} 
                        placeholder={placeholder ? placeholder : label} 
                        onChange={onChange}
                        value={value}
                        name={name}
                    />
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

export default InputField