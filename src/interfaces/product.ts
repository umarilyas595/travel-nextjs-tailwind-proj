export type VariationType = '1' | '2' | '3' | '' | null
export interface IProductHorizontalSlide {
    Title: string
    Description?: string
    data?: any
    isHover?:boolean
    isAddButton?: boolean
    isDesc?: boolean
    url? : string
    locationsState : [] | any
    type?: 'detail-card' | 'title-card'
    v_type?: VariationType
    slidesToShow?: number
    isAutomate?: boolean
    route?:string
}