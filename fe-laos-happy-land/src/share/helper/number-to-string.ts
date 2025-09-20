export const numberToString = (
  number: number | undefined | null,
  language = "vi-VN",
) => {
  // Handle undefined, null, or invalid numbers
  if (number === undefined || number === null || isNaN(number)) {
    return "Liên hệ";
  }

  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(0) + " tỷ";
  }
  if (number >= 1000000) {
    return (number / 1000000).toFixed(0) + " triệu";
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(0) + " nghìn";
  }
  return number.toLocaleString(language);
};
