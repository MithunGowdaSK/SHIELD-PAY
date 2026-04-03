// Centralized time utilities
export const now = () => new Date();

export const toISO = (d) => (d instanceof Date ? d.toISOString() : new Date(d).toISOString());
export const fromISO = (s) => new Date(s);

export const formatDate = (date) =>
  date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const daysBetween = (a, b) => Math.floor((a - b) / (1000 * 60 * 60 * 24));

export const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export default { now, toISO, fromISO, formatDate, addDays, daysBetween, startOfToday };