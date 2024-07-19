import React from 'react'
import PopupWithOverlay from '../UIComponents/Popup/PopupWithOverlay'
import TopSearch from './top-search'

interface ISearchPopup {
    show: boolean,
    onClose: () => void
}

const SearchPopup = ({show, onClose}: ISearchPopup)=> {

    return (
        <PopupWithOverlay show={show} onClose={() => {onClose()}}>
            <div className="px-4">
                <TopSearch />
            </div>

        </PopupWithOverlay>
    )
}

export default SearchPopup