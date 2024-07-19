import { ModeType } from "@/interfaces/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL
const PY_API_URL = process.env.NEXT_PUBLIC_PY_API_URL
const APP_MODE: ModeType = "Production"

export { API_URL, PY_API_URL, APP_MODE }