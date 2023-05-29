export const getTimeColor = (fastest: boolean, pb: boolean) => {
  if (fastest) return "text-indigo-500";
  else if (pb) return "text-emerald-500";
  return "";
};
