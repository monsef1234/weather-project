export interface SavedLocation {
    Key: string,
    LocalizedName: string,
    Temperature: {
        Metric: {
            Value: number,
            Unit: string,
            UnitType: number
        }
    }
}
