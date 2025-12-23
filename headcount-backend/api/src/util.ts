
export const getDayDifference = (newTimestamp:number, oldTimestamp:number) => {
  return Math.round(Math.abs(oldTimestamp - newTimestamp)/60/60/24);
}
