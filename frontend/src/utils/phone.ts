// Phone utilities: formatting and validation per country

export function getMaxPhoneLength(countryCode: string): number {
  const lengths: Record<string, number> = {
    '+1': 10,   // US/Canada
    '+63': 10,  // Philippines
    '+44': 11,  // UK
    '+86': 11,  // China
    '+81': 11,  // Japan
    '+82': 11,  // South Korea
    '+65': 8,   // Singapore
    '+60': 10,  // Malaysia
    '+66': 9,   // Thailand
    '+84': 10,  // Vietnam
    '+62': 12,  // Indonesia
    '+91': 10,  // India
    '+61': 9,   // Australia
    '+64': 9    // New Zealand
  }
  return lengths[countryCode] ?? 10
}

export function getMinPhoneLength(countryCode: string): number {
  const lengths: Record<string, number> = {
    '+1': 10,   // US/Canada
    '+63': 10,  // Philippines
    '+44': 10,  // UK
    '+86': 11,  // China
    '+81': 10,  // Japan
    '+82': 10,  // South Korea
    '+65': 8,   // Singapore
    '+60': 9,   // Malaysia
    '+66': 8,   // Thailand
    '+84': 9,   // Vietnam
    '+62': 10,  // Indonesia
    '+91': 10,  // India
    '+61': 9,   // Australia
    '+64': 8    // New Zealand
  }
  return lengths[countryCode] ?? 8
}

export function getCountryName(countryCode: string): string {
  const names: Record<string, string> = {
    '+1': 'US/Canada',
    '+63': 'Philippines',
    '+44': 'UK',
    '+86': 'China',
    '+81': 'Japan',
    '+82': 'South Korea',
    '+65': 'Singapore',
    '+60': 'Malaysia',
    '+66': 'Thailand',
    '+84': 'Vietnam',
    '+62': 'Indonesia',
    '+91': 'India',
    '+61': 'Australia',
    '+64': 'New Zealand'
  }
  return names[countryCode] ?? 'selected country'
}

// Format a numeric-only phone string according to country patterns
export function formatPhoneByCountry(phone: string, countryCode: string): string {
  if (!phone) return ''

  switch (countryCode) {
    case '+1': // US/Canada: (123) 456-7890
      if (phone.length >= 6) {
        return `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6)}`
      } else if (phone.length >= 3) {
        return `(${phone.substring(0, 3)}) ${phone.substring(3)}`
      }
      return phone

    case '+63': // Philippines: 0912 345 6789
      if (phone.length >= 7) {
        return `${phone.substring(0, 4)} ${phone.substring(4, 7)} ${phone.substring(7)}`
      } else if (phone.length >= 4) {
        return `${phone.substring(0, 4)} ${phone.substring(4)}`
      }
      return phone

    case '+44': // UK: 01234 567890
      if (phone.length >= 6) {
        return `${phone.substring(0, 5)} ${phone.substring(5)}`
      }
      return phone

    case '+65': // Singapore: 1234 5678
      if (phone.length >= 4) {
        return `${phone.substring(0, 4)} ${phone.substring(4)}`
      }
      return phone

    default: // Default formatting: groups of 3-4 digits
      if (phone.length >= 6) {
        return `${phone.substring(0, 3)} ${phone.substring(3, 6)} ${phone.substring(6)}`
      } else if (phone.length >= 3) {
        return `${phone.substring(0, 3)} ${phone.substring(3)}`
      }
      return phone
  }
}

export function isValidPhoneForCountry(phone: string, countryCode: string): boolean {
  switch (countryCode) {
    case '+1': // US/Canada: must not start with 0 or 1
      return !/^[01]/.test(phone)

    case '+63': // Philippines: mobile starts with 9, landline varies
      return /^(9|2|3|4|5|6|7|8)/.test(phone)

    case '+44': // UK
      return /^(1|2|3|7|8)/.test(phone)

    case '+65': // Singapore: starts with 6, 8, or 9
      return /^[689]/.test(phone)

    case '+86': // China: mobile starts with 1
      return /^1/.test(phone)

    case '+81': // Japan
      return /^[1-9]/.test(phone)

    case '+82': // South Korea: mobile starts with 1
      return /^1/.test(phone)

    case '+91': // India: 6-9
      return /^[6-9]/.test(phone)

    default:
      return true
  }
}
