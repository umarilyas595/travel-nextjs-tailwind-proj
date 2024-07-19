import React, { useState, useEffect } from "react";
import StarImage from "/public/images/star.png";
import Image from "next/image";
import { BlankStar, FilledStar } from "../icons/Stars";

interface IFilters {
  filters?: any;
  title?: string;
  type?: string;
  setRanking?: any;
  clearFilter?:any;
  location?:any;
}

export default function ReviewFilterBox({
  filters,
  title,
  type,
  setRanking,
  clearFilter,
  location,
}: IFilters) {
  const [filtersData, setFiltersData] = useState<any[]>([]);

  useEffect(() => {
    setFiltersData(filters);
  }, [filters]);

  useEffect(() => {
    if(clearFilter == true){
      let filtersArray = filtersData;
      filtersArray.map((options: any) => {
        return options.active = false
      });
      setFiltersData([...filtersArray]);
    }
  }, [clearFilter]);

  const handleRating = async (filters: any, index: number) => {
    let filtersArray = filtersData;
    setRanking(filters.label);
    await filtersArray.map((options: any) => {
      if (filters.label == options.label && filters.type == title) {
        options.active = true;
      } else {
        options.active = false;
      }
    });
    setFiltersData([...filtersArray]);
  };

  return (
    <div className="py-7 border-b border-[#E3E3E3]">
      <h1 className="text-[18px] font-bold">{title}</h1>
      <div className="flex flex-wrap items-center gap-4 mt-5">
        {filtersData.length &&
          filtersData.map((filters: any, index: number) => {
            return (
              <div
                key={index}
                className={`flex items-center justify-center py-2 px-3 rounded-md ${
                  filters.active === true
                    ? "border-[var(--blue)] text-[var(--blue)]"
                    : "border-[#898989] text-[#898989]"
                } border cursor-pointer`}
                onClick={() => [
                  handleRating(filters, index),
                  // setRanking(filters.label)
                ]}
              >
                <span className=" text-[14px] font-bold mr-1">{filters.label}</span>
                {type === "review" ? (
                  filters.active == false ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.4505 5.63406L11.3543 4.90408L9.07611 0.352135C9.01388 0.227506 8.91152 0.126615 8.78506 0.0652895C8.46793 -0.0890138 8.08254 0.0395723 7.92397 0.352135L5.64581 4.90408L0.549539 5.63406C0.409035 5.65384 0.280575 5.71912 0.182222 5.81803C0.0633192 5.93848 -0.00220171 6.10053 5.64944e-05 6.26856C0.0023147 6.4366 0.0721672 6.59688 0.194265 6.71418L3.88148 10.2572L3.01036 15.2602C2.98993 15.3766 3.003 15.4963 3.04808 15.6057C3.09316 15.7151 3.16845 15.8099 3.26541 15.8793C3.36237 15.9488 3.47713 15.99 3.59666 15.9984C3.7162 16.0068 3.83573 15.982 3.9417 15.9269L8.50004 13.5648L13.0584 15.9269C13.1828 15.9922 13.3273 16.0139 13.4658 15.9902C13.8151 15.9308 14.0499 15.6044 13.9897 15.2602L13.1186 10.2572L16.8058 6.71418C16.9062 6.61724 16.9724 6.49064 16.9925 6.35216C17.0467 6.00597 16.8018 5.68549 16.4505 5.63406Z"
                        fill="#CCC8C5"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.4505 5.63406L11.3543 4.90408L9.07611 0.352135C9.01388 0.227506 8.91152 0.126615 8.78506 0.0652895C8.46793 -0.0890138 8.08254 0.0395723 7.92397 0.352135L5.64581 4.90408L0.549539 5.63406C0.409035 5.65384 0.280575 5.71912 0.182222 5.81803C0.0633192 5.93848 -0.00220171 6.10053 5.64944e-05 6.26856C0.0023147 6.4366 0.0721672 6.59688 0.194265 6.71418L3.88148 10.2572L3.01036 15.2602C2.98993 15.3766 3.003 15.4963 3.04808 15.6057C3.09316 15.7151 3.16845 15.8099 3.26541 15.8793C3.36237 15.9488 3.47713 15.99 3.59666 15.9984C3.7162 16.0068 3.83573 15.982 3.9417 15.9269L8.50004 13.5648L13.0584 15.9269C13.1828 15.9922 13.3273 16.0139 13.4658 15.9902C13.8151 15.9308 14.0499 15.6044 13.9897 15.2602L13.1186 10.2572L16.8058 6.71418C16.9062 6.61724 16.9724 6.49064 16.9925 6.35216C17.0467 6.00597 16.8018 5.68549 16.4505 5.63406Z"
                        fill="#009de2"
                      />
                    </svg>
                  )
                ) : (
                  ""
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
