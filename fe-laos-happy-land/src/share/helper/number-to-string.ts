export const numberToString = (
  number: number | undefined | null,
  locale = "vi",
  currency = "VND",
) => {
  let value = ["tỷ", "triệu", "nghìn"];
  if (currency === "USD") {
    value = ["billion", "million", "thousand"];
  }
  if (currency === "LAK") {
    value = ["kips", "millions", "thousands"];
  }

  let language = "vi-VN";
  if (locale === "en") {
    language = "en-US";
  }
  if (locale === "la") {
    language = "la-LA";
  }
  // Handle undefined, null, or invalid numbers
  if (number === undefined || number === null || isNaN(number)) {
    return "Liên hệ";
  }

  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(0) + " " + value[0] + " " + currency;
  }
  if (number >= 1000000) {
    return (number / 1000000).toFixed(0) + " " + value[1] + " " + currency;
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(0) + " " + value[2] + " " + currency;
  }
  return number.toLocaleString(language);
};
