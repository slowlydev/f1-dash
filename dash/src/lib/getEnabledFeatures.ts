export const getEnabledFeatures = (): string[] => {
  return JSON.parse(localStorage.getItem("experimentalFeatures") ?? "[]") ?? [];
};
