export const sortPos = (a: { position: string }, b: { position: string }) => {
  return parseInt(a.position) - parseInt(b.position);
};
