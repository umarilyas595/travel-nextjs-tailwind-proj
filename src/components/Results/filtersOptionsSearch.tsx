import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
// import SelectCheckBoxSimple from "../UIComponents/MultiSelectDropdown/label";
import StyledCheckbox from '../UIComponents/MultiSelectDropdown/label'

export default function CardOptionsSearchListing({
  title,
  categories,
  onChange,
  clearData,
  selectedData,
  setClearFilter,
  disabled = false
}: {
  title?: string;
  categories?: any;
  onChange?: (val: any[]) => void;
  clearData?: any;
  selectedData?: any;
  setClearFilter?:any,
  disabled?: boolean
}) {
  const [isShowDropDown, setIsShowDropDown] = useState(false);
  const [opt, setOpt] = useState<any[]>([]);
  const [optSelected, setOptSelected] = useState<any[]>([]);
  const [check, setCheck] = useState(false);
  const [postPerPage, setPostPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPost = opt.slice(indexOfFirstPost, indexOfLastPost);

  // useEffect(() => {
  //   if (selectedData?.length > 0) {
  //     opt?.map((item: any) => {
  //       item.checked = false;
  //       setCheck(true);
  //     });
  //   } else {
  //     opt?.map((item: any) => {
  //       item.checked = false;
  //       setOptSelected([]);
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedData]);

  // useEffect(() => {
  //   if (check == true) {
  //     if (selectedData?.length > 0) {
  //       setOptSelected(selectedData);
  //       setCheck(false);
  //     } else {
  //       setOptSelected([]);
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [check]);

//   useEffect(() => {
//     let empty: any = [];
//     const selected = optSelected?.map((opt) => opt);
//     if (optSelected?.length) {
//       onChange(selected);
//     } else {
//       onChange(empty);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [optSelected]);

  useEffect(() => {
    const _load = async () => {
      const newArray = await categories?.map((name: any, index: any) => {
        return {
          name: name?.name,
          checked: name.checked ? name.checked : false,
          id: name?.id,
        }
      });
      setOpt(newArray);
    }

    _load()

  }, [categories]);

  useEffect(() => {
    console.log(clearData,"clearData")
    if (clearData == true) {
      setOptSelected([]);
      const newArray = categories?.map((name: any, index: any) => ({
        name: name?.name,
        checked: false,
        id: name?.id,
      }));
      setOpt(newArray);

      if(typeof setClearFilter === 'function')
      {
        setClearFilter(false)
      }
    }
  }, [clearData]);

  const FetchData = (opt: any, optSelected: any) => {
    opt?.filter((original: any) => {
      return optSelected?.some((selected: any) => {
        if (original?.name === selected?.opt && original?.checked == false) {
          original.checked = true;
        }
      });
    });
  };

  // useEffect(() => {
  //   if(typeof onChange !== "undefined")
  //   {
  //     onChange(optSelected)
  //   }
  //   // FetchData(opt, optSelected);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [optSelected, opt]);

  const handleChange = async (e: any) => {
    const name = e.target.name;
    const optChecked = e.target.checked;

    const newArray = await opt?.map((opts: any) =>
      name === opts?.name ? { ...opts, checked: optChecked } : opts
    );
    setOpt(newArray);
    // if (optChecked) {
    //   setOptSelected([...optSelected, { opt: name, checked: optChecked }]);
    // } else {
    //   const arr = optSelected
    //     .map((opt) =>
    //       name === opt?.opt ? { ...opt, checked: optChecked } : opt
    //     )
    //     .filter((opt) => opt.checked && opt);
    //   setOptSelected(arr);
    // }
    let selected = await newArray.filter(opts => opts.checked == true)
    if(typeof onChange !== "undefined")
    {
      onChange(selected)
    }
  };

  return (
    <Box
    className="py-7"
      width="100%"
      borderBottom="1px solid #DBDBDB"
      sx={{
        "&: last-child": {
          borderBottom: "none",
        },
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        height="40px"
        onClick={() => setIsShowDropDown(!isShowDropDown)}
        sx={{
          cursor: "pointer",
        }}
      >
        <Box mr="5px">
          {/* <Image
            src={
              isShowDropDown
                ? "/images/icons/triangle-bottom-icon.svg"
                : "/images/icons/triangle-right-primary-icon.svg"
            }
            width="17px"
            height="17px"
            layout="fixed"
            alt=""
          /> */}
        </Box>
        <Box>
        <h1 className="text-[18px] font-bold">{title}</h1>
        </Box>
      </Box>
      {/* {isShowDropDown && ( */}
        <Box pt="10px" pb="13px">
          {currentPost.length > 0 && currentPost?.map(({ name, checked }: any, index: any) => {
            
            return (
              <Box mb="10px" key={index}>
                <Box display="flex" alignItems="center">
                  <Box mr="5px">
                    <StyledCheckbox
                      onChange={(e:any) => {
                        handleChange(e);
                      }}
                      name={name}
                      checked={checked}
                      disabled={disabled}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body1" color="black">
                      {name}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      {/* )} */}
      {opt.length > postPerPage && (
        <button className="border-none outline-none text-[#009DE2] underline" onClick={() => {
          setPostPerPage(postPerPage + 10) 
        }}>
          Show more
        </button>
      )}
    </Box>
  );
}
