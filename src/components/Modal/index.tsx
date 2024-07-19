import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import RatingStars from "@/components/UIComponents/RatingStars";
import InputField from "../UIComponents/InputField/InputField";
import { validateHeaderValue } from "http";
import Textarea from "../UIComponents/InputField/textarea";
import { AiOutlineClose } from "react-icons/ai";
import axios from 'axios';
import { API_URL } from '@/config/constant'
import {ReviewsCall} from '@/api-calls'
import { setReviews } from '@/redux/reducers/reviews'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'

interface IReview {
  first_name?: string;
  second_name?: string;
  review?: string;
  rating?: number
}

export default function Modal({ openModal, setOpenModal, modalFor }: any) {
  const dispatch = useAppDispatch()
  const [submitDisabled, setSubmitDisabled] = useState(true)
  const [ratingNumber, setRating] = useState(0)
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState<IReview>({
    first_name: "",
    second_name: "",
    review: "",
    rating: 0,
  });

  const handleValue = (e: any) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setValue({...value, rating: ratingNumber});
  }, [ratingNumber]);

  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (openModal == true) {
      setOpen(openModal);
    }
    if (open == false) {
      setOpenModal(open);
    }
  }, [openModal, open]);

  useEffect(()=>{
if(value.first_name !== "" && value.second_name !== "" && value.review !== ""){
  setSubmitDisabled(false)
}else{
  setSubmitDisabled(true)
}
  },[value])
 
  const handlePostReview = () => {
    axios.post(`${API_URL}/reviews`,value)
    .then((res)=>{
      console.log(res,"review submit")
      setValue({
        first_name: "",
    second_name: "",
    review: "",
    rating: 0,
      })
      setOpen(false)
      const reviews = async () => {
        let reviewsRes = await ReviewsCall()
        console.log("reviewsRes",reviewsRes)
        dispatch(setReviews(reviewsRes))
    }
    reviews()
    })
    .catch((error)=>{
      console.log(error,"review not submit")
    })
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
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
              <div ref={cancelButtonRef} className="flex justify-center items-center w-full">
              {modalFor == "review" && (
                <Dialog.Panel className="relative transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-auto w-[95%] realtive">
                  <div className="bg-white lg:px-10 px-5 sm:pt-14 pt-5 pb-10 rounded-xl">
                    <div className="w-full">
                      <div className="mt-3 text-center lg:ml-4 sm:mt-0 sm:text-left">
                        <p className="text-[#2D2D2D] sm:text-[33px] text-[22px] font-medium lg:text-start text-center">
                          Write Your Review
                        </p>
                        <div className="mt-5 flex justify-center items-center w-full">
                          <div className="flex lg:flex-row flex-col items-center lg:justify-between justify-center w-full lg:gap-x-8 gap-x-0 lg:gap-y-0 md:gap-y-8 gap-y-2">
                              <p className="uppercase text-[12px] font-medium">
                                please rate us
                              </p>
                              <div className="flex items-center lg:gap-x-1 gap-x-0">
                                <RatingStars setRating={setRating} />
                              </div>
                            <InputField
                              type="text"
                              label="FIRST NAME"
                              value={value.first_name}
                              onChange={(e) => {
                                handleValue(e);
                              }}
                              placeholder="First Name..."
                              name="first_name"
                              className="md:mt-0 sm:mt-7 mt-4 lg:w-auto w-full"
                            />
                            <InputField
                              type="text"
                              label="LAST NAME"
                              value={value.second_name}
                              onChange={(e) => {
                                handleValue(e);
                              }}
                              placeholder="Last Name..."
                              name="second_name"
                              className="md:mt-0 sm:mt-7 mt-4 lg:w-auto w-full"
                            />
                          </div>
                        </div>
                        <Textarea
                          label="WRITE YOUR REVIEW"
                          value={value.review}
                          onChange={(e) => {
                            handleValue(e);
                          }}
                          placeholder="Enter Your Review"
                          name="review"
                          className="mt-7"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-4 sm:pb-14 pb-7 sm:flex sm:flex-row-reverse sm:px-6 gap-x-5">
                    <button
                      type="button"
                      className={`sm:w-[186px] w-full h-[46px] text-white justify-center rounded-md text-sm font-semibold  ${submitDisabled === false ? "bg-[#009DE2]" : "bg-gray-300"}`}
                      onClick={handlePostReview}
                      disabled={submitDisabled}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="mt-3 sm:w-[186px] w-full h-[46px] justify-center rounded-md bg-white border border-[#009DE2] text-[#009DE2] text-sm font-semibold hover:bg-[#009DE2] hover:text-white sm:mt-0"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="absolute z-10 top-[-30px] right-[-20px] w-[53px] h-[53px] rounded-full bg-white flex justify-center items-center" onClick={()=>{setOpen(false)}}>
                    <AiOutlineClose />
                  </div>
                </Dialog.Panel>
              )}
              {modalFor == "view_other_places" && (
                <Dialog.Panel className="relative transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-auto realtive">
                <div className="bg-white md:px-10 px-5 pt-14 pb-10 rounded-xl">
                  <div className="w-full">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex flex-col items-center">
                      <p className="text-[#2D2D2D] text-[33px] font-medium capitalize">
                      Enter your email to view other plans
                      </p>
                      <div className="flex justify-center items-center w-full mt-10">
                        <div className="flex lg:flex-row flex-col items-center lg:justify-between justify-center w-full lg:gap-x-8 gap-x-0 lg:gap-y-0 md:gap-y-8 gap-y-2">
                          <InputField
                            type="text"
                            label="FIRST NAME"
                            value={value.first_name}
                            onChange={(e) => {
                              handleValue(e);
                            }}
                            placeholder="First Name..."
                            name="first_name"
                            className="md:mt-0 mt-7"
                          />
                          <InputField
                            type="email"
                            label="Email"
                            value={value.second_name}
                            onChange={(e) => {
                              handleValue(e);
                            }}
                            placeholder="Email..."
                            name="email"
                            className="md:mt-0 mt-7"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center pb-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-[#009DE2] px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    Submit
                  </button>
                </div>
                <div className="absolute z-10 top-[-30px] right-[-20px] w-[53px] h-[53px] rounded-full bg-white flex justify-center items-center" onClick={()=>{setOpen(false)}}>
                  <AiOutlineClose />
                </div>
              </Dialog.Panel>
              )}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
