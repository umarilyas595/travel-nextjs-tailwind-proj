import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import InputField from "../UIComponents/InputField/InputField";
import { AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/navigation";

export default function Modal({ show, onClose }: any) {
    const router = useRouter();
  const [submitDisabled, setSubmitDisabled] = useState(true)
  const [value, setValue] = useState("");

  const handleValue = (e: any) => {
    setValue(e.target.value);
  };

  const cancelButtonRef = useRef(null);

  useEffect(()=>{
if(value !== ""){
  setSubmitDisabled(false)
}else{
  setSubmitDisabled(true)
}
  },[value])

  const buildTrip = () => {
      onClose()
    router.push("/trip-plan?address=" + value)
    setValue("")
  }

  const skipLocation = () => {
    onClose()
    router.push("/trip-plan?address=Canada")
    setValue("")
  }

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => onClose()}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div ref={cancelButtonRef} className="flex justify-center items-center sm:px-0 px-10">
                <Dialog.Panel className="relative transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-auto w-[95%] realtive">
                  <div className="bg-white lg:px-10 px-5 sm:pt-14 pt-5 pb-10 rounded-xl ">
                    <div className="w-full flex flex-col items-center">
                        <p className="text-[#2D2D2D] sm:text-[28px] text-[22px] font-medium text-center md:w-[70%] w-full">
                          Enter Your Location Where You Want To Go
                        </p>
                            <InputField
                              type="text"
                              label="Location"
                              value={value}
                              onChange={(e) => {
                                handleValue(e);
                              }}
                              placeholder="Enter Location"
                              name="location"
                              className="mt-8 sm:w-[400px] w-full"
                            />
                      </div>
                  </div>
                  <div className="px-4 sm:pb-14 pb-7 sm:flex sm:flex-row-reverse justify-center sm:px-6 gap-x-5">
                    <button
                      type="button"
                      className={`sm:w-[186px] w-full h-[46px] text-white justify-center rounded-md text-sm font-semibold  ${submitDisabled === false ? "bg-[#009DE2]" : "bg-gray-300"}`}
                      onClick={buildTrip}
                      disabled={submitDisabled}
                    >
                      Build a Trip
                    </button>
                    <button
                      type="button"
                      className="mt-3 sm:w-[186px] w-full h-[46px] justify-center rounded-md bg-white border border-[#009DE2] text-[#009DE2] text-sm font-semibold hover:bg-[#009DE2] hover:text-white sm:mt-0"
                      onClick={skipLocation}
                      ref={cancelButtonRef}
                    >
                      Skip
                    </button>
                  </div>
                  <div className="absolute z-10 top-[-30px] right-[-20px] w-[53px] h-[53px] rounded-full bg-white flex justify-center items-center" onClick={() => {
                        setValue("")
                        onClose()
                    }}>
                    <AiOutlineClose />
                  </div>
                </Dialog.Panel>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
