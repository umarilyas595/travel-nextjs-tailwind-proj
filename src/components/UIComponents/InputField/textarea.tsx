import { IInputField } from '@/interfaces'
import React from 'react'

const Textarea = ({className,name, label, value="", placeholder="", onChange= (e)=>{}, icon}: IInputField) => {

    return (
        <div className={`relative ${className}`}>
            <div className="relative">
                <div className="border border-[#C9D2DD] bg-white rounded-2xl py-4 px-5 flex items-center">
                    {
                        icon && <div className="mr-1">{icon}</div>
                    }
                    <textarea 
                        className={`outline-none w-full`} 
                        placeholder={placeholder ? placeholder : label} 
                        onChange={onChange}
                        value={value}
                        name={name}
                    ></textarea>
                </div>
            </div>
            <label className="absolute top-[-0.7rem] left-[1rem] px-[5px]"
            style={{background: "linear-gradient(360deg, #fff, #fff, #fff, transparent, transparent)"}}
            >{label}</label>
        </div>
    )

}

export default Textarea