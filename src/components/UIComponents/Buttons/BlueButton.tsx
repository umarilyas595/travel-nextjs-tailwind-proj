import React, { MouseEvent } from 'react'

interface IBlueButton extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, React.AriaAttributes {
    title: string;
}

const BlueButton:React.FC<IBlueButton> = (props) => {

    const {children, title, className, ...rest} = props;
    return (
        <button className={`py-3 border border-solid border-[var(--blue)] bg-[var(--blue)] hover:bg-white text-white hover:text-[var(--blue)] rounded-xl w-[200px] my-2 transition-all duration-300 ${className}`}
        {...rest}
        >
            {title}
        </button>
    )
}

export const BlueButtonOutLined:React.FC<IBlueButton> = (props) => {

    const {children, title, className, ...rest} = props;
    let ClassName = `py-2 border border-solid border-[var(--blue)] bg-white hover:bg-[var(--blue)] text-[var(--blue)] hover:text-white rounded-xl w-[200px] my-2 transition-all duration-300 ${className}`
    return (
        <button className={ClassName}
        {...rest}
        >
            {title}
        </button>
    )
}

export default BlueButton