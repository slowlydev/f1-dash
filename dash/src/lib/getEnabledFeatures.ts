export const getEnabledFeatures = (): string[] => {
  if (typeof window === "undefined" || !!!window) return [];
  return JSON.parse(localStorage.getItem("experimentalFeatures") ?? "[]") ?? [];
};
