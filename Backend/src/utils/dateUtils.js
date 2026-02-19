export const getTodayDateString = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const isDateWithinRange = (dateStr, startDate, endDate) => {
  const date = new Date(dateStr);
  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return date >= start && date <= end;
};

export const getDayOfWeek = (dateStr) => {
  // 0 = Sunday ... 6 = Saturday
  return new Date(dateStr).getDay();
};
