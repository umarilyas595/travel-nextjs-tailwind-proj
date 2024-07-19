"use client"

import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react"

type AlertTypes = 'warning' | 'success' | 'error' | ''

interface IshowAlert {
    title: string
    type: AlertTypes
}

type IinitialValues = {
    showAlert: ({title, type}: IshowAlert) => void
}

const initialValues: IinitialValues = {
    showAlert: () => {}
}

const AlertContext = createContext(initialValues)

export const useAlertContext = () => {
    return useContext(AlertContext)
}

interface IAlertProvider {
    children: ReactNode
}

export const AlertProvider = ( {children} : IAlertProvider ) => {
    const [isAlert, setIsAlert] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')
    const [type, setType] = useState<AlertTypes>('')

    const alertRef = useRef<HTMLDivElement | null>(null)

    const showAlert = ({title, type}: IshowAlert) => {
        setType(type)
        setTitle(title)
        setIsAlert(true)
    }

    const values = {
        showAlert
    }

    useEffect(() => {
        if(isAlert)
        {
            alertRef.current?.classList.remove('hidden')
            setTimeout(() => {
                alertRef.current?.classList.remove('opacity-0')
                alertRef.current?.classList.remove('-translate-y-full')
                alertRef.current?.classList.add('-translate-y-1/2')
            }, 200);

            setTimeout(() => {
                alertRef.current?.classList.add('opacity-0')
                alertRef.current?.classList.remove('-translate-y-1/2')
                alertRef.current?.classList.add('-translate-y-full')
                setTimeout(() => {
                    alertRef.current?.classList.add('hidden')
                    setIsAlert(false)
                }, 200);
            }, 3000)
        }
        else
        {
            alertRef.current?.classList.add('opacity-0')
            alertRef.current?.classList.remove('-translate-y-1/2')
            alertRef.current?.classList.add('-translate-y-full')
            alertRef.current?.classList.add('hidden')
        }
    }, [alertRef, isAlert])

    const svgsFunc = () => {
        if(type === "error")
        {
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        }
        else if(type === "success")
        {
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        }
        else if(type === "warning")
        {
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
        }
    }

    return (
        <AlertContext.Provider value={values}>
            {children}

            <div ref={alertRef} className={`hidden opacity-0 -translate-y-full fixed top-[50%] left-[50%] -translate-x-1/2 rounded-lg large-shadow p-4 z-10 transition-all duration-300`} style={{
                backgroundColor: type == "error" ? "#fee2e2" : type == "success" ? "#f0fdf4" : type == "warning" ? "#fefce8" : "#fff",
                color: type == "error" ? "#ef4444" : type == "success" ? "#22c55e" : type == "warning" ? "#eab308" : "#000"
                }}>
                <p className="flex"> 
                <span className='mr-1'>
                    { svgsFunc() }
                </span>
                <span dangerouslySetInnerHTML={{__html: title}}></span>
                </p>
            </div>
        </AlertContext.Provider>
    )
}