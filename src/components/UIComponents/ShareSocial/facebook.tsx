import { FacebookShareButton } from "react-share";
import { FaFacebookF } from "react-icons/fa";
import styles from "./social.module.css";
import {useSearchParams} from 'next/navigation'

export default function Facebook() {
  const params = useSearchParams();
  const paramsAddress = params.get("address");
  const URL = `https://weplan.ai/trip-plan?address${paramsAddress}`
  return (
    <>
      <FacebookShareButton
        url={URL} //eg. https://www.example.com
        //  quotes={"Enjoy the trip"}  //"Your Quotes"
        hashtag={"#trip"} // #hashTag
      >
        <div
          className={`${styles["social_icon"]} rounded-full flex justify-center items-center text-white text-[12px]`}
        >
          <FaFacebookF />
        </div>
      </FacebookShareButton>
    </>
  );
}
