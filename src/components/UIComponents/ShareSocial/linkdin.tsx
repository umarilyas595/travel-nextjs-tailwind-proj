import { LinkedinShareButton } from "react-share";
import { FaLinkedinIn } from "react-icons/fa";
import styles from "./social.module.css";
import {useSearchParams} from 'next/navigation'

export default function Linkdin() {
     const params = useSearchParams();
  const paramsAddress = params.get("address");
  const URL = `https://weplan.ai/trip-plan?address${paramsAddress}`
  return (
    <>
      <LinkedinShareButton
        url={URL} //eg. https://www.example.com
        //  quotes={"Enjoy the trip"}  //"Your Quotes"
        // hashtag={"#trip"} // #hashTag
      >
        <div
          className={`${styles["social_icon"]} rounded-full flex justify-center items-center text-white text-[12px]`}
        >
          <FaLinkedinIn />
        </div>
      </LinkedinShareButton>
    </>
  );
}
