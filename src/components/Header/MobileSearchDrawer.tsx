import React from 'react'
import TopSearch from './top-search'

interface IMobileSearchDrawer {
    show: boolean,
    onClose: () => void
}

const MobileSearchDrawer = ({show, onClose}: IMobileSearchDrawer) => {

    return (
        <div className={`fixed inset-0 bg-slate-100 z-10 ${!show ? 'translate-x-full' : 'translate-x-0'} duration-500 transition-all`}>
            
            <div className="absolute top-2 right-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"
                onClick={() => onClose()}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <div className="mt-16 mx-3">
                <TopSearch />
            </div>
        </div>
    )
}

export default MobileSearchDrawer