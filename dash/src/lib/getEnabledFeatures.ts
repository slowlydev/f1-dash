export const getEnabledFeatures = (): string[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("experimentalFeatures") ?? "[]") ?? [];
};
