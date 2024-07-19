import React, { useEffect, useRef, useState } from 'react'

interface IPopupOverlay {
    show: boolean
    onClose: () => void
    children: React.ReactNode
    childrenParentClass?: string
    wrapperClass?: string
}

const PopupWithOverlay = ({show, onClose=()=> {}, children, childrenParentClass, wrapperClass}: IPopupOverlay) => {

    const [showPopup, setShowPopup] = useState(false)
    const overlayRef = useRef<null | HTMLDivElement>(null)

    useEffect(() => {
        setShowPopup(show)
    }, [show])

    useEffect(() => {
        if(showPopup)
        {
            overlayRef?.current?.classList.remove('hidden')
            document.body?.classList.add('fit-screen')
            setTimeout(() => {
                overlayRef?.current?.classList.remove('opacity-0')
            }, 100);
        }
        else
        {
            overlayRef?.current?.classList.add('opacity-0')
            setTimeout(() => {
                overlayRef?.current?.classList.add('hidden')
                document.body?.classList.remove('fit-screen')
            }, 300);
        }
    }, [showPopup])

    return (
        <div id={`overlayPopup`} ref={overlayRef} className={`hidden opacity-0 fixed inset-0 z-20 bg-[rgba(0,0,0,0.5)] max-h-screen h-screen transition-all duration-300`}>
            <div className="flex justify-center items-center mt-[5vh] mx-[1rem]">
                <div className={`bg-white p-10 max-w-[900px] w-full rounded-xl relative ${wrapperClass ?? ''}`}>
                    <span 
                    className="absolute top-[-1rem] right-[-0.5rem] w-[30px] h-[30px] bg-[#F9F9F9] flex justify-center items-center rounded-full p-2 cursor-pointer select-none"
                    onClick={() => onClose()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </span>
                    <div className={`max-h-[80vh] h-full overflow-auto pt-4 pr-2 ${childrenParentClass ?? ''}`}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PopupWithOverlay