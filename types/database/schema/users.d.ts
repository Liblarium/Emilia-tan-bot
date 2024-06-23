/* prettier-ignore */
export interface IUsers {
  id: string;
  info?: {
    username: string;
    dostup?: {
      base: string, 
      reader?: string,
      additional_access?: string[],
      max_rank?: number
    },
    dn?: number,
    pol?: string,
    perms?: number,
    tityl?: string[],
    bio?: string,
    potion?: number,
    level?: {
      global: {
        xp: number,
        level: number,
        max_xp: number,
        next_xp: string
      },
      local?: {[key: string]: {
        id: string,
        xp: number,
        level: number,
        max_xp: number,
        next_xp: string
      }}
    },
    pechenie?: number,
    clan?: number
  }
}
