export const getData = () => {
  return JSON.parse(localStorage.getItem("appData")) || {};
};

export const saveData = (data) => {
  localStorage.setItem("appData", JSON.stringify(data));
};