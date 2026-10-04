export type Units = 'metric' | 'imperial'

const kilometresPerMile = 1.609344

/** A distance given in kilometres, shown in the chosen units with one decimal place ("5.0 km", "3.1 mi"). */
export function formatDistance(kilometres: number, units: Units): string {
  return units === 'metric' ? `${kilometres.toFixed(1)} km` : `${(kilometres / kilometresPerMile).toFixed(1)} mi`
}
