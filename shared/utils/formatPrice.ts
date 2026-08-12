export const formatTHPrice = (price: number) => {
  return new Intl.NumberFormat('th-TH').format(price)
}
