export interface PJMDataItem {
    interval_start_local: string;
    interval_start_utc: string;
    interval_end_local: string;
    interval_end_utc: string;
    net_load: number;
    renewables: number;
    renewables_to_load_ratio: number;
    primary_power_source: string;
    load: {
        load: number;
        ae: number;
        aep: number;
        aps: number;
        atsi: number;
        bc: number;
        comed: number;
        dayton: number;
        deok: number;
        dom: number;
        dpl: number;
        duq: number;
        ekpc: number;
        jc: number;
        me: number;
        pe: number;
        pep: number;
        pjm_mid_atlantic_region: number;
        pjm_rto: number;
        pjm_southern_region: number;
        pjm_western_region: number;
        pl: number;
        pn: number;
        ps: number;
        reco: number;
        ug: number;
    };
    load_forecast: {
        publish_time_local: string;
        publish_time_utc: string;
        load_forecast: number;
    };
    fuel_mix: {
        coal: number;
        gas: number;
        hydro: number;
        multiple_fuels: number;
        nuclear: number;
        oil: number;
        solar: number;
        storage: number;
        wind: number;
        other: number | null;
        other_renewables: number;
    };
}