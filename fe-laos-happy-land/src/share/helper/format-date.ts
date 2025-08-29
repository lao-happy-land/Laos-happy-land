export const formatCreatedDate = (date: string | Date, language = "vi-VN") => {
  if (!date) return "Hôm nay";
  const dateObj = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - dateObj.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Hôm qua";
  if (diffDays <= 7) return `${diffDays} Ngày trước`;
  return dateObj.toLocaleDateString(language);
};
