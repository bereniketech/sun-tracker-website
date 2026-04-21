export interface EmailSubscription {
  id: string
  user_id: string
  email: string
  lat: number
  lng: number
  location_name: string
  opted_in: boolean
  created_at: string
  updated_at: string
}

export interface SunHighlight {
  date: string
  sunrise: string
  sunset: string
  dayLength: string
  goldenHourStart: string
  goldenHourEnd: string
  blueHourStart: string
  blueHourEnd: string
}

export interface MonthlyReport {
  month: string
  year: number
  location: string
  lat: number
  lng: number
  averageSunrise: string
  averageSunset: string
  averageDayLength: string
  sunriseShortestDay: string
  sunriseLongestDay: string
  sunsetShortestDay: string
  sunsetLongestDay: string
  highlights: SunHighlight[]
  goldenHourDates: string[]
}

export interface EmailReportSubscribeRequest {
  email: string
  lat: number
  lng: number
  location_name: string
}
