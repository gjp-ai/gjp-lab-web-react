import { describe, expect, it } from 'vitest'
import { celsiusToFahrenheit, fahrenheitToCelsius, formatTemperature } from './temperature'

describe('temperature', () => {
  it('converts between Celsius and Fahrenheit', () => {
    expect(celsiusToFahrenheit(100)).toBe(212)
    expect(celsiusToFahrenheit(-40)).toBe(-40)
    expect(fahrenheitToCelsius(32)).toBe(0)
  })

  it('formats with at most one decimal place', () => {
    expect(formatTemperature(20)).toBe('20')
    expect(formatTemperature(37.777)).toBe('37.8')
  })
})
