import lodash from 'lodash';

export interface HomeData {
    debouncedSearch: ReturnType<typeof lodash.debounce>
    searches: SearchResult[]
    loading: boolean
    search: string
    noResults: boolean
    openSuggestions: boolean
    disableSearch: boolean
}

export interface SearchResult {
    Version: number;
    Key: string;
    Type: string;
    Rank: number;
    LocalizedName: string;
    Country: {
        ID: string;
        LocalizedName: string;
    };
    AdministrativeArea: {
        ID: string;
        LocalizedName: string;
    };
}

export interface GeopositionResult {
    Version: number;
    Key: string;
    Type: string;
    Rank: number;
    LocalizedName: string;
    EnglishName: string;
    PrimaryPostalCode: string;
    Region: {
        ID: string;
        LocalizedName: string;
        EnglishName: string;
    };
    Country: {
        ID: string;
        LocalizedName: string;
        EnglishName: string;
    },
    AdministrativeArea: {
        ID: string;
        LocalizedName: string;
        EnglishName: string;
        Level: number;
        LocalizedType: string;
        EnglishType: string;
        CountryID: string;
    },
    TimeZone: {
        Code: string;
        Name: string;
        GmtOffset: number;
        IsDaylightSaving: boolean;
        NextOffsetChange: string;
    },
    GeoPosition: {
        Latitude: number;
        Longitude: number;
        Elevation: {
            Metric: {
                Value: number;
                Unit: string;
                UnitType: number;
            },
            Imperial: {
                Value: number;
                Unit: string;
                UnitType: number;
            }
        }
    },
    IsAlias: boolean;
    ParentCity: {
        Key: string;
        LocalizedName: string;
        EnglishName: string;
    },
    SupplementalAdminAreas: [
        {
            Level: number;
            LocalizedName: string;
            EnglishName: string;
        }
    ],
    DataSets: string[]
}