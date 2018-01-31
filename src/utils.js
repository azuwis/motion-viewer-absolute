function padDate (str) {
  return String('00' + str).slice(-2)
}

export function getDate (date) {
  return `${date.getFullYear()}-${padDate(date.getMonth() + 1)}-${padDate(date.getDate())}`
}
