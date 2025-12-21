
interface appData {
  name: string,
  usercountChrome: number,
  usercountFirefox: number,
  usercountEdge: number
}

interface Props {
  data: {
    data: appData[];
  };
}
