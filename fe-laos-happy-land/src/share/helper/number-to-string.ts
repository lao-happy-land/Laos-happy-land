export const numberToString = (
  number: number | undefined | null,
  locale = "en",
  currency = "USD",
) => {
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

  // Return exact number with locale formatting
  return (
    number.toLocaleString(language, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) +
    " " +
    currency
  );
};
