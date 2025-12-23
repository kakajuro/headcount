
interface appData {
  id: number,
  name: string,
  shortname: string,
  usercountChrome: number,
  usercountFirefox: number,
  usercountEdge: number
}


interface Props {
  data: {
    data: appData[];
  };
  form? : {
    error: string
  }
}
