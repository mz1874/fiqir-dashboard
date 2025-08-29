import axios from "@/api/axios";

const API_KEY = "fe21bd8ae9844b3f912e4601b02d1406";

export default function getPJMFuelMixData(start: string, end: string, timezone: string) {
    return axios.get("https://api.gridstatus.io/v1/datasets/pjm_fuel_mix/query", {
        params: {
            start_time: start,
            end_time: end,
            timezone: timezone,
            api_key: API_KEY,
        },
    });
}
