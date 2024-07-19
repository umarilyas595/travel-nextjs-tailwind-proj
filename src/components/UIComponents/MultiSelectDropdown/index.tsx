import React, { useState, useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckboxLabel from "./label";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import addOccasion from '@/api-calls/fromDB/addOccasion'
import Occassions from '@/api-calls/fromDB/occassions'
import { setOccasions } from '@/redux/reducers/occasionsSlice'
import { useAppDispatch,useAppSelector } from "@/redux/hooks";
import addPriorities from '@/api-calls/fromDB/addPriorities'
import Priorities from '@/api-calls/fromDB/priority'
import { setPriorities } from '@/redux/reducers/prioritySlice'
import styles from './index.module.css'
import Section from "../Section";
import SortPopupOptions from "./sort-popup-options";
import Tooltip from '@mui/material/Tooltip';

interface TypeProps {
  items: string[] | any;
  placeholder: string;
  onChange: Function;
  searchBar?: boolean;
  heightItemsContainer?: string;
  SelectedData?: string[] | any;
  Label?: string;
  className?:string
  disabled?:any;
  saveData?:any;
  setSaveData?:any;
  allowSorting?: boolean;
  dropdownWidth?:string
}

interface TypeOpt {
  opt: string;
  checked: boolean;
  id?: any;
}

const Inputsearch = styled("input")(() => {
  return {
    backgroundColor: "transparent",
    width: "100%",
    border: "0",
    fontSize: "16px",
    color: "black",
  };
});

export default function SelectCheckBoxSimple({
  items,
  placeholder,
  onChange,
  searchBar,
  heightItemsContainer,
  Label,
  SelectedData,
  disabled,
  className,
  saveData,
  setSaveData,
  allowSorting,
  dropdownWidth
}: TypeProps) {
  const dispatch = useAppDispatch();
  const [showDropDown, setShowDropDown] = useState(false);
  const [search, setSearch] = useState("");
  const [opts, setOpts] = useState<any[]>([]);
  const [optsSelected, setOptsSelected] = useState<TypeOpt[]>([]);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const [addCustomeOption, setAddCustomeOption] = useState(false);
  const [customeField, setCustomeField] = useState("");
  const [addFieldError, setAddFieldError] = useState(false)
  const ref = useRef<HTMLInputElement>(null);
  const [requestFailedError,setRequestFailedError] = useState(false)
  const [selectedOptionString, setSelectedOptionString] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [showSorting, setShowSorting] = useState(false)
  const [loading, setLoading] = useState(false)

  const sortRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    if(SelectedData?.length > 0 && saveData == true){
      setOptsSelected(SelectedData)
      setSaveData(false)
    }
      },[SelectedData])

  useEffect(() => {
    const newArray: any = items?.map((opt: any) => ({ opt, checked: false }));
    setOpts(newArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(()=>{
if(addCustomeOption == false){
  setCustomeField("")
}
  },[addCustomeOption])

  useEffect(() => {
    if(selectRef)
    {
        window.addEventListener('click', (e) => {
            if(selectRef.current)
            {
                if(!selectRef.current.contains((e.target as Element)))
                {
                    setShowDropDown(false)
                }
            }
        })
    }
  }, [])

  useEffect(() => {
    if(showSorting)
    {
      sortRef.current?.classList.remove('hidden')
      sortRef.current?.classList.add('fixed')
        setTimeout(() => {
          sortRef.current?.classList.remove('opacity-0')
        }, 200);
    }
    else
    {
      sortRef.current?.classList.add('opacity-0')
        setTimeout(() => {
          sortRef.current?.classList.add('hidden')
          sortRef.current?.classList.remove('fixed')
        }, 200);
    }
  }, [showSorting])

  useEffect(() => {
    if(showDropDown == false){
      setRequestFailedError(false)
    }
    setAddCustomeOption(false)
    setAddFieldError(false)
    setCustomeField("")
    if(showDropDown)
    {
        ref.current?.classList.remove('hidden')
        setTimeout(() => {
            ref.current?.classList.remove('opacity-0')
            ref.current?.classList.remove('-translate-y-5')
        }, 200);
    }
    else
    {
        ref.current?.classList.add('opacity-0')
        ref.current?.classList.add('-translate-y-5')
        setTimeout(() => {
            ref.current?.classList.add('hidden')
        }, 200);
    }
  }, [showDropDown])

  useEffect(() => {
    let SelectedOption:any[] = []
    optsSelected.map((opt:any,index:number)=>{
      SelectedOption.push(opt.opt)
    })
    let convertIntoString = SelectedOption.toString()
    setSelectedOptionString(convertIntoString)

    let empty: any = [];
    const selected = optsSelected?.map((opt) => opt);
    if (optsSelected?.length > 0) {
      onChange(selected);
    } else {
      onChange(empty);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optsSelected]);

  const FetchData = () => {
    var Arr: any = [];
    var result1 = opts?.filter((original: any) => {
      return optsSelected?.some((selected: any) => {
        if (
          original?.opt?.name === selected?.opt &&
          original?.checked == false
        ) {
          original.checked = true;
          // Arr.push({ opt: original.opt.name, checked: true, id: original.opt.id });
        }
      });
    });
  };

  useEffect(() => {
    console.log(opts,"opts",optsSelected)
    FetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts, optsSelected]);

  const inputSearch = React.useRef<HTMLInputElement>(null);

  const focusInputSearch = () => inputSearch?.current?.focus();

  const handleAddLabel = (e: React.MouseEvent<HTMLInputElement>) => {
    setAddCustomeOption(true);
    setRequestFailedError(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const optName = e.target.name;
    const optChecked = e.target.checked;
    const optId = e.target.id;

    setInputValue("")
    const newArray = opts.map((opt) =>
      optName === opt.opt ? { ...opt, checked: optChecked, id: optId } : opt
    );
    setOpts(newArray);

    if (optChecked) {
      setOptsSelected([
        ...optsSelected,
        { opt: optName, checked: optChecked, id: optId },
      ]);
    } else {
      const arr = optsSelected
        .map((opt) =>
          optName == opt?.opt
            ? { ...opt, checked: optChecked, id: optId }
            : opt
        )
        .filter((opt) => opt.checked && opt);

      const newArray = opts?.map((opt) => ({ ...opt, checked: optChecked }));
      setOpts(newArray);
      setOptsSelected(arr);
    }
  };

  const clearOne = (optToDelete: string) => {
    const newArray = opts.map((opt) =>
      optToDelete === opt.opt ? { ...opt, checked: false } : opt
    );
    setOpts(newArray);
    const arr = optsSelected
      .map((opt) =>
        optToDelete === opt.opt ? { ...opt, checked: false } : opt
      )
      .filter((opt) => opt.checked && opt);

    const newArray2 = opts?.map((opt) => ({ ...opt, checked: false }));
    setOpts(newArray2);
    setOptsSelected(arr);
    setOptsSelected(arr);
  };

  const clearAll = () => {
    setOptsSelected([]);
    const newArray = opts?.map((opt) => ({ ...opt, checked: false }));
    setOpts(newArray);
  };

  const filtered = opts?.filter(({ opt }) => {
    return opt?.name?.toLocaleLowerCase().includes(customeField != "" ? customeField.toLocaleLowerCase(): inputValue.toLocaleLowerCase());
  });

  const AddField = async (value:string) => {
    setLoading(true)
    if(Label == "Occasion"){
      const filteredArray = opts?.filter(({ opt }) => {
        return opt?.name?.toLocaleLowerCase() == value.toLocaleLowerCase();
      });
      if(filteredArray.length <= 0 ){
        let AddField = await addOccasion(value)
        setCustomeField("");
        setAddCustomeOption(false);
        if(AddField){
          setLoading(false)
          // let updatedOccasionsList = await Occassions()
          // dispatch(setOccasions(updatedOccasionsList))
          let array = opts
          let selected = optsSelected
          array.unshift({opt:{name:value, id:""}, checked: true})
          selected.unshift({opt:value, id:"", checked: true})
          setOpts([...array])
          setOptsSelected([...selected])
        }else{
          setLoading(false)
          setRequestFailedError(true)
        }
      }else{
        setAddFieldError(true)
      }
    }

    if(Label == "Priority"){
      const filteredArray = opts?.filter(({ opt }) => {
        return opt?.name?.toLocaleLowerCase() == value.toLocaleLowerCase();
      });

      if(filteredArray.length <= 0 ){
        let AddField = await addPriorities(value)
        setCustomeField("");
        setAddCustomeOption(false);
        if(AddField){
          setLoading(false)
          let array = opts
          let selected = optsSelected
          array.unshift({opt:{name:value, id:""}, checked: true})
          selected.unshift({opt:value, id:"", checked: true})
          setOpts([...array])
          setOptsSelected([...selected])
        }else{
          setLoading(false)
          setRequestFailedError(true)
        }
      }else{
        setAddFieldError(true)
      }
    }
    
    setCustomeField("");
    setInputValue("")
    // setAddCustomeOption(false);
  };

  return (
    <Box ref={selectRef} className={`relative sm:px-1 sm:my-2 my-5 ${className}`}>
      
      <div className="absolute top-[-0.5rem] left-0 w-full flex justify-center items-center">
        <label 
          className="px-[5px] text-[11px] uppercase letter-spacing" 
          style={{background: "linear-gradient(360deg, #fff, #fff, #fff, transparent, transparent)"}}
        >{Label}</label>
      </div>
      <Tooltip title={`You can select multiple ${Label}`}  placement="top-start">
      <Box className="flex items-center justify-center border border-[#C9D2DD] h-[57px] w-full bg-white rounded-2xl py-4 px-2">
        <Box
          className="flex items-center justify-center w-full overflow-hidden cursor-pointer"
        >
          <Box
          className="overflow-hidden"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            // width="100%"
            onClick={()=>{
            setShowDropDown(true)
          }}
          >
            {optsSelected.length <= 0 ?(
            <input className="text-[#999999]  outline-none h-full" placeholder={`Enter ${Label}`} value={inputValue} onChange={(e)=>{
              setInputValue(e.target.value)
            }}
            onFocus = {()=>{
              setAddFieldError(false)
              setRequestFailedError(false)
            }}
            />
            ):(
              <div className="text-ellipsis overflow-hidden whitespace-nowrap">{selectedOptionString}</div>
            )}
            {/* {optsSelected?.length > 0 &&
              optsSelected?.map(( opt , index) => {
                return (
                  <div
                    key={index}
                    className="bg-[#009de2] px-2 py-1 flex items-center justify-center"
                  >
                    {Label !== "Occasion" &&(
                      <Typography
                      className="text-center"
                        color="common.white"
                        fontSize="10px"
                        fontWeight="400"
                      >
                        {opt?.opt}
                      </Typography>
                    )}
                    <Typography
                    className="text-center"
                      color="common.white"
                      fontSize="10px"
                      fontWeight="400"
                    >
                      {opt?.opt}
                    </Typography>
                    <img
                      className="cursor-pointer w-[10px] h-[10px] ml-3"
                      src="/images/icons/close-white-icon.svg"
                      alt=""
                      onClick={() => clearOne(opt?.opt)}
                    />
                  </div>
                );
              })} */}
            {/* {!optsSelected?.length && (
              <Typography color="#999999">{placeholder}</Typography>
            )} */}
          </Box>
          <span
            className="flex justify-center items-center cursor-pointer w-auto ml-3"
            onClick={()=>{
              setShowDropDown(!showDropDown)
              setSearch("")
            }
          }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </span>
        </Box>
      </Box>
      </Tooltip>
      {/* Dropdown list */}
      <Box
      ref={ref}
      className={`${dropdownWidth} w-full overflow-x-hidden rounded-xl large-shadow hidden opacity-0 -translate-y-5 transition-all duration-300`}
        position="absolute"
        left="0"
        right="0"
        bgcolor="common.white"
        zIndex="3"
      >
        <Box className="relative">
          {/* {disabled && optsSelected.length >= 10 && (
            <Box className="absolute top-0 left-0 w-full h-full bg-gray-500 opacity-25 z-10"></Box>
          )} */}
        
          {/* Selected Options List */}
          {optsSelected.length > 0 && (
            <div className="flex items-center">
              <div className={`w-[98%] flex items-center gap-x-2 px-3 py-2 overflow-x-auto ${styles["showSelectedOptions"]}`} >
                {
                optsSelected.map((opt:any,index:number)=>{
                  return (
                    <div
                      key={index}
                      className="bg-[#009de2] px-3 py-1 flex items-center justify-center rounded-full w-max whitespace-nowrap"
                    >
                      {Label !== "Occasion" && Label != "Location" &&(
                        <Typography
                        className="mr-2"
                          color="common.white"
                          fontSize="10px"
                          fontWeight="400"
                        >
                          {index+1}.
                        </Typography>
                      )}
                      <Typography
                      className="text-center"
                        color="common.white"
                        fontSize="10px"
                        fontWeight="400"
                      >
                        {opt?.opt}
                      </Typography>
                      <img
                        className="cursor-pointer w-[10px] h-[10px] ml-3"
                        src="/images/icons/close-white-icon.svg"
                        alt=""
                        onClick={() => clearOne(opt?.opt)}
                      />
                    </div>
                  )
                })
                }
              </div>
              {
                allowSorting && optsSelected.length > 1 && (
                  <Tooltip title={"Click and Re-order the priorities through drag and drop."}>
                  <div className="text-[var(--blue)]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor" className="w-7 h-7 p-[3px] mb-[5px] cursor-pointer"
                    onClick={() => setShowSorting(true)}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                    </svg>
                  </div>
                  </Tooltip>
                )
              }
            </div>
          )}

          {/* Search bar to find out limited options */}
          {searchBar && addCustomeOption === false && (
            <Box
              borderBottom="1px dashed #E5E5E5"
              pl="20px"
              pr="10px"
              className="flex bg-[rgb(239,242,247)] justify-between items-center h-[39px]"
              onClick={focusInputSearch}
            >
              <Box width="100%" mr="10px">
                <Inputsearch
                  onChange={(e: any) => setSearch(e.target.value)}
                  style={{ outline: "none" }}
                  ref={inputSearch}
                  placeholder="Search"
                />
              </Box>
              <Box>
                <img src="/images/icons/search-input-icon.svg" alt="" />
              </Box>
            </Box>
          )}

          {/* Input box when add custom option in the list */}
          <Box
            borderBottom="1px dashed #E5E5E5"
            display={!addCustomeOption? "none" : "flex"}
            pl="20px"
            pr="10px"
            className="bg-[rgb(239,242,247)] justify-between items-center h-[39px] w-full"
            onClick={focusInputSearch}
          >
            <Box width="100%" mr="10px">
              <Inputsearch
                onChange={(e: any) => setCustomeField(e.target.value)}
                style={{ outline: "none" }}
                placeholder={`Add ${Label}`}
                value={customeField}
                onFocus={()=>{setAddFieldError(false)}}
              />
            </Box>
            <Box className={`flex items-center text-[20px] ${loading == false ? "block" : "hidden"}`}>
              <AiFillCheckCircle
                className="text-green-700 cursor-pointer mr-1"
                onClick={()=>{AddField(customeField)}}
              />
              <AiFillCloseCircle
                className="text-red-500 cursor-pointer"
                onClick={() => {
                  setAddCustomeOption(false);
                  setAddFieldError(false)
                  setCustomeField("");
                }}
              />
            </Box>
            <div role="status" className={`${loading == true ? "block" : "hidden"}`}>
    <svg aria-hidden="true" className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
</div>
          </Box>
          {addFieldError == true && addCustomeOption == true && customeField != "" && Label != "Location"  &&(
            <p className="text-[red] text-[14px] mt-1 text-center">{Label} already exist in the list.</p>
          )}
          {requestFailedError == true && Label != "Location" && (
            <p className="text-[red] text-[14px] mt-1 text-center">{Label} invalid.</p>
          )}

          <Box
          className="flex flex-col items-center"
            height={heightItemsContainer}
            py="10px"
            sx={{ overflowY: "auto" }}
          >
            <div className="w-[80%]">
              {Label != "Location" && (
              <span
                className={`flex items-center gap-x-3 pb-3 px-6 cursor-pointer select-none ${addCustomeOption ? "hidden" : ""}`}
                onClick = {handleAddLabel}
              >
                <span
                  className="flex justify-center items-center w-[20px] h-[20px] rounded-full bg-[#4B9AD4] text-white "
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                  </svg>
                </span>
                <p className="text-[#4B9AD4] text-[14px]">Add {Label}</p>
              </span>
)}
              {filtered.length > 0 ? (
                filtered?.map(({ opt, checked }, index) => {
                  return (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      py="5px"
                      pl="20px"
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: "grey.200",
                        },
                      }}
                    >
                      {/* {Label !== "Occasion" && Label != "Location" && (
                      <span className="text-[#9e9e9e] mr-2 w-[20px] flex justify-end">{index+1}.</span>
                      )} */}
                      <CheckboxLabel
                        label={opt?.name}
                        onChange={handleChange}
                        name={opt?.name}
                        id={index+1}
                        checked={checked}
                        marginLabel="7px"
                      />
                    </Box>
                  );
                })
              ):(
                <div className="h-full w-full flex items-center justify-center px-2 mt-10">
<p className="text-black text-[14px] mt-1 text-center">{Label} not exist. {addCustomeOption == false && Label != "Location" && (
  <span>
    <span className="text-[#009de2] underline cursor-pointer" onClick={()=>{
      if(optsSelected.length <= 0){
        AddField(inputValue)
      }else{
        setAddCustomeOption(true)
      }
    }}>Add {Label} </span> if you want.
  </span>
)}
</p>
                </div>
              )}
            </div>
          </Box>
        </Box>
      </Box>

      <div ref={sortRef} className={`hidden opacity-0 inset-0 bg-[rgba(0,0,0,0.5)] z-20 transition-all duration-300`} >
        <div className="absolute top-[50%] -translate-y-1/2 left-[50%] -translate-x-1/2 transition-all duration-300 max-w-[450px] w-full sm:px-0 px-10">
          <div 
            className="bg-white shadow p-4 mx-auto rounded-xl relative">
              <div className="bg-white absolute top-[-0.5rem] right-[-0.5rem] rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer"
                onClick={() => setShowSorting(false)}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h4 className="font-semibold text-[24px]">Sort {Label}</h4>
              {
                optsSelected.map((opt:TypeOpt, index:number) => {
                  return <SortPopupOptions key={index} index={index} opt={opt} onSort={async (num, dropPlace) => {

                    let _optsSelected = [...optsSelected]
                    if (dropPlace === "after")
                    {
                      let prev = _optsSelected.slice(0, num)
                      let between = _optsSelected.slice(num + 1, index + 1)
                      let current = _optsSelected.slice(num, num+1)
                      let next = _optsSelected.slice(index + 1)
                      _optsSelected = [...prev, ...between, ...current, ...next]
                    }
                    else
                    {
                      let prev = _optsSelected.slice(0, index)
                      let between = _optsSelected.slice(index, num)
                      let current = _optsSelected.slice(num, num+1)
                      let next = _optsSelected.slice(num + 1)
                      _optsSelected = [...prev, ...current, ...between, ...next]
                    }

                    setOptsSelected(_optsSelected)
                  }} />
                })
              }
          </div>
        </div>
      </div>
    </Box>
  );
}
