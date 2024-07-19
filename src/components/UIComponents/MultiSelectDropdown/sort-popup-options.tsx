import React, { useRef, useState } from 'react'
import styles from "./index.module.css"

type DropPlace = 'before' | 'after' | null

interface ISortPopupOptions {
    index: number
    opt: any
    onSort: (num: number, dropPlace: DropPlace) => void
}

const SortPopupOptions = ({index, opt, onSort}: ISortPopupOptions) => {

    const dragableRef = useRef<HTMLInputElement>(null)
    const [dropPlace, setDropPlace] = useState<DropPlace>(null)

    return (
        <div 
            onDragOver={async (e) => {
                e.preventDefault()

                let _index = await localStorage.getItem('multiselect_sort_index')
                if(Number(_index) !== index && Number(_index) > index)
                {
                    let element: HTMLDivElement = e.target as HTMLDivElement
                    if(!dragableRef.current?.previousElementSibling?.classList.contains(styles.drop_animate))
                    {
                        dragableRef.current?.previousElementSibling?.classList?.add(styles.drop_animate)
                        setDropPlace('before')
                    }
                }

                if(Number(_index) !== index && Number(_index) < index)
                {
                    let element: HTMLDivElement = e.target as HTMLDivElement
                    if(!dragableRef.current?.nextElementSibling?.classList.contains(styles.drop_animate))
                    {
                        dragableRef.current?.nextElementSibling?.classList?.add(styles.drop_animate)
                        setDropPlace('after')
                    }
                }
            }}

            onDragLeave={(e) => {
                if(dragableRef.current?.previousElementSibling?.classList.contains(styles.drop_animate))
                {
                    dragableRef.current?.previousElementSibling?.classList?.remove(styles.drop_animate)
                }

                if(dragableRef.current?.nextElementSibling?.classList.contains(styles.drop_animate))
                {
                    dragableRef.current?.nextElementSibling?.classList?.remove(styles.drop_animate)
                }
            }}

            onDrop={async (e) => {
                e.preventDefault()
                let _index = await localStorage.getItem('multiselect_sort_index')
                if(_index)
                {
                    onSort(Number(_index), dropPlace)
                }

                if(dragableRef.current?.previousElementSibling?.classList.contains(styles.drop_animate))
                {
                    dragableRef.current?.previousElementSibling?.classList?.remove(styles.drop_animate)
                }

                if(dragableRef.current?.nextElementSibling?.classList.contains(styles.drop_animate))
                {
                    dragableRef.current?.nextElementSibling?.classList?.remove(styles.drop_animate)
                }
            }}
            >
            <div className={`w-full h-[5px] rounded-xl relative transition-all duration-300`} />
            
            <span ref={dragableRef} className="border border-[var(--blue)] bg-gray-100 rounded-xl overflow-hidden flex cursor-grab relative" draggable={true}
            
            onDragStart={(e) => {
                localStorage.setItem('multiselect_sort_index', index.toString())
                let element: HTMLDivElement = e.target as HTMLDivElement
                if(!element.classList.contains(styles.selected_box))
                {
                element.classList?.add(styles.selected_box)
                }
                // e.dataTransfer.setData("multiselect_sort_index", index.toString());
            }}

            onDragEnd={(e) => {
                let element = e.target as HTMLSpanElement
                if(element.classList.contains(styles.selected_box))
                {
                element.classList.remove(styles.selected_box)
                }
            }}
            >
                <span className="bg-white w-[25px] flex justify-center items-center">{index+1}.</span>
                {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 rotate-90 my-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                </svg> */}
                <span className="bg-[var(--blue)] text-white text-center p-2 w-full ">{opt.opt}</span>
            </span>

            <div className={`w-full h-[5px] rounded-xl relative transition-all duration-300`} />
        </div>
    )
}

export default SortPopupOptions