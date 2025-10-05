export const numberToString = (
  number: number | undefined | null,
  locale = "en",
  currency = "USD",
) => {
  // Default unit values based on currency
  let value = ["billion", "million", "thousand"];

  if (locale === "en") {
    value = ["billion", "million", "thousand"];
  } else if (locale === "vn") {
    value = ["tỷ", "triệu", "nghìn"];
  } else if (locale === "la") {
    value = ["ຕື້", "ລ້ານ", "ພັນ"];
  }

  let language = "en-US";
  if (locale === "en") {
    language = "en-US";
  } else if (locale === "la") {
    language = "la-LA";
  } else if (locale === "vn") {
    language = "vi-VN";
  }

  // Handle undefined, null, or invalid numbers
  if (number === undefined || number === null || isNaN(number)) {
    return locale === "en" ? "Contact" : locale === "la" ? "ຕິດຕໍ່" : "Liên hệ";
  }

  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1) + " " + value[0] + " " + currency;
  }
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + " " + value[1] + " " + currency;
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(0) + " " + value[2] + " " + currency;
  }
  return number.toLocaleString(language) + " " + currency;
};
