
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

// Last 2 cannot be pulled from the db
// Require /counts/week route
// Added here so typescript doesn't scream at me
export interface countRecord {
  id: number,
  shortname: string,
  name: string,
  usercountChrome: number,
  usercountFirefox: number,
  usercountEdge: number,
  created_at: number
  dayDifference?: number,
  userDifference?: number
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
