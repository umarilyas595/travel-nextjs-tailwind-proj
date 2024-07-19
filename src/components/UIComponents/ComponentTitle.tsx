import React from 'react'

interface IComponentTitle {
    title: string
}

const ComponentTitle = ({title}: IComponentTitle) => {
    return title ? 
    <h3 className="font-bold text-2xl md:text-[38px] gilroy capitalize text-center">{title}</h3> :
    <div className="animate-pulse flex items-center justify-center mb-4 bg-gray-300 rounded dark:bg-gray-700 max-w-[300px] w-full h-[30px]"></div>
}

export default ComponentTitle