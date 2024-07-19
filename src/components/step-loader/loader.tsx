import React from 'react'
import style from "./loader.module.css"

const Loader = () => {
    return (
        <div id='step-loader' className="fixed top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 w-[100px] h-[100px] bg-gray-300 z-[20] rounded-full">
            <div className={style["circle-container"]}>
                <div className={style["circle"]}>
                    <div className={`${style.item} ${style['layer-1']}`}>
                    <div className={style["fill"]}></div>
                    </div>
                    <div className={`${style.item} ${style['layer-2']}`}>
                    <div className={style["fill"]}></div>
                    </div>
                    <div className={style["inside-content"]}>64%</div>
                </div>
            </div>
        </div>
    )
}

export default Loader