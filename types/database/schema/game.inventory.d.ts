export interface IGameInventory {
  id: string;
  /* prettier-ignore */
  invetory?: Record<string, { 
    name: string,
    item: string, //id предмета
    count: number, 
    weight: number,
  }>,
  max_inv_size: number;
  max_inv_weight: number;
}
