
export const getDayDifference = (newTimestamp:number, oldTimestamp:number) => {
  return Math.floor(Math.abs(oldTimestamp - newTimestamp)/60/60/24);
}
