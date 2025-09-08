import axios from "@/api/axios";

const API_KEY = "fe21bd8ae9844b3f912e4601b02d1406";

/**
 * Fuel Mix
 * @param start
 * @param end
 * @param timezone
 */
export function getPJMFuelMixData(start: string, end: string, timezone: string) {
    return axios.get("https://api.gridstatus.io/v1/datasets/pjm_fuel_mix/query", {
        params: {
            start_time: start,
            end_time: end,
            timezone: timezone,
            api_key: API_KEY,
        },
    });
}

export function getLocationalMarginalPrice(start: string, end: string, timezone: string, filter_value: string) {
    return axios.get("https://api.gridstatus.io/v1/datasets/pjm_lmp_day_ahead_hourly/query", {
        params: {
            start_time: start,
            end_time: end,
            timezone: timezone,
            api_key: API_KEY,
            filter_column: "location",
            filter_value: filter_value
        },
    });
}


export function getLocationalLMP(start: string, end: string, timezone: string) {
    return axios.get("https://api.gridstatus.io/v1/datasets/pjm_lmp_real_time_5_min/query", {
        params: {
            start_time: start,
            end_time: end,
            timezone: timezone,
            api_key: API_KEY,
            page_size: 100,
        },
    });
}

export function getStandardized5MinData(start: string, end: string, timezone: string) {
    return axios.get("https://api.gridstatus.io/v1/datasets/pjm_standardized_5_min/query", {
        params: {
            start_time: start,
            end_time: end,
            timezone: timezone,
            api_key: API_KEY,
        },
    });
}
