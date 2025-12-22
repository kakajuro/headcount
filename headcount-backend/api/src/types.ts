
export interface app {
  name: string,
  shortname: string
}

export interface appDelete {
  id: number
}

export interface countAdd {
  shortname: string,
  usercountChrome: number,
  usercountFirefox: number,
  usercountEdge: number
}

export interface response {
  id: number
}

export interface countResponse {
  'COUNT(*)': string
}

export interface shortnameResponse {
  'COUNT(shortname)': string
}
