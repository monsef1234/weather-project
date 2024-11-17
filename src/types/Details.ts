export interface DetailsData {
    currentWeather: CurrentWeather;
    hourlyWeather: HourlyWeather[];
    fiveDayWeather: FiveDayForecast;
    loadingStates: {
        currentWeather: boolean;
        hourlyWeather: boolean;
        fiveDayWeather: boolean;
    };
}


export interface CurrentWeather {
    LocalObservationDateTime: string;
    EpochTime: number;
    WeatherText: string;
    WeatherIcon: number;
    HasPrecipitation: boolean;
    PrecipitationType: string | null;
    IsDayTime: boolean;
    Temperature: {
        Metric: {
            Value: number;
            Unit: string;
            UnitType: number;
        };
        Imperial: {
            Value: number;
            Unit: string;
            UnitType: number;
        };
    };
    MobileLink: string;
    Link: string;
}

export interface HourlyWeather {
    DateTime: string;
    EpochDateTime: number;
    WeatherIcon: number;
    IconPhrase: string;
    HasPrecipitation: boolean;
    IsDaylight: boolean;
    Temperature: {
        Value: number;
        Unit: string;
        UnitType: number;
    };
    PrecipitationProbability: number;
    MobileLink: string;
    Link: string;
}

export interface FiveDayForecast {
    Headline: {
        EffectiveDate: string;
        EffectiveEpochDate: number;
        Severity: number;
        Text: string;
        Category: string;
        EndDate: string;
        EndEpochDate: number;
        MobileLink: string;
        Link: string;
    };
    DailyForecasts: DailyForecast[];
}

export interface DailyForecast {
    Date: string;
    EpochDate: number;
    Temperature: {
        Minimum: {
            Value: number;
            Unit: string;
            UnitType: number;
        };
        Maximum: {
            Value: number;
            Unit: string;
            UnitType: number;
        };
    };
    Day: {
        Icon: number;
        IconPhrase: string;
        HasPrecipitation: boolean;
    };
    Night: {
        Icon: number;
        IconPhrase: string;
        HasPrecipitation: boolean;
    };
    Sources: string[];
    MobileLink: string;
    Link: string;
}
