
const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Nov", "Dec"]
const monthsLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"]

/**
 * @returns {[string, number, string]}
 */
function getMonthYear() {
  const date = new Date();
  const monthIndex = date.getMonth();
  return [monthsShort[monthIndex], date.getFullYear(), monthsLong[monthIndex]]
}

module.exports = { getMonthYear }