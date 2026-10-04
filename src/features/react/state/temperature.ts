export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9
}

/** At most one decimal place, without a trailing ".0" (20, 68, 37.8). */
export function formatTemperature(value: number): string {
  return String(Math.round(value * 10) / 10)
}
