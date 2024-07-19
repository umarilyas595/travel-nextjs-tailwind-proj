import { TwitterShareButton } from "react-share";
import { FaTwitter } from "react-icons/fa";
import styles from "./social.module.css";
import {useSearchParams} from 'next/navigation'

export default function Twitter() {
    const params = useSearchParams();
    const paramsAddress = params.get("address");
    const URL = `https://weplan.ai/trip-plan?address${paramsAddress}`
  return (
    <>
      <TwitterShareButton
        url={URL} //eg. https://www.example.com
      >
        <div
          className={`${styles["social_icon"]} rounded-full flex justify-center items-center text-white text-[12px]`}
        >
          <FaTwitter />
        </div>
      </TwitterShareButton>
    </>
  );
}
