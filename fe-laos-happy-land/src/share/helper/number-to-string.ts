export const numberToString = (number: number, locale = "vi-VN") => {
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(0) + " tỷ";
  }
  if (number >= 1000000) {
    return (number / 1000000).toFixed(0) + " triệu";
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(0) + " nghìn";
  }
  return number.toString();
};
