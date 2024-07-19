export interface ITripPlanParams {
    address: string,
    location_id: string,
    place_id: string,
    v_type: string,
    restaurants: null,
    start_day_index: string,
    days_length: string,
    occassions?: any[],
    priorities?: any[]
}

export interface IPlanningCard {
    data?: any,
    onOpen: (value?: any) => void,
    variation?: "list" | "cards" | "cards-list"
    rows?: string
    isDropdownButton?: boolean
    items?: any
    filteredLocations?: any[]
}

export interface ITripPlanningHeader {
    variation: "space-arround" | "space-between"
}