import {Range} from "react-date-range"

interface DefaultField {
    className?: string,
    label: string,
    placeholder?: string,
    icon?: any,
    onChange?: (value?: any) => void,
    name?: string,
    styling?: any ,
}
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
    onFocus?:any
}
export interface ISelectField extends IInputField  {
    data: any
}

export interface ISelectOptions {
    additional?: boolean
    id: string | number
    name: string
}

export interface IDateRangeField extends DefaultField  {
    value: Range
}

export default IInputField