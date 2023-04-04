const formatDate = (isoDateString) => {
  const date = new Date(isoDateString);

  // Convert the date to Estonian time (UTC+2 or UTC+3 depending on daylight saving)
  const estonianDate = new Date(
    date.getTime() + (date.getTimezoneOffset() + (date.dst() ? 180 : 120)) * 60 * 1000,
  );

  const day = String(estonianDate.getDate()).padStart(2, '0');
  const month = String(estonianDate.getMonth() + 1).padStart(2, '0');
  const year = estonianDate.getFullYear();
  const hours = String(estonianDate.getHours()).padStart(2, '0');
  const minutes = String(estonianDate.getMinutes()).padStart(2, '0');

  return `${day}.${month}.${year}, ${hours}:${minutes}`;
};

// eslint-disable-next-line no-extend-native
Date.prototype.dst = function () {
  const year = this.getFullYear();
  const start = new Date(year, 2, 31);
  const end = new Date(year, 9, 31);
  let day = start.getDay() - 1;
  start.setDate(31 - day);
  day = end.getDay() - 1;
  end.setDate(31 - day);

  return this >= start && this <= end;
};

module.exports = formatDate;
