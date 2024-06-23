export interface IGameItems {
  id: string;
  name: string;
  weight: number;
  price: number;
  isDrop?: boolean;
  isSale?: boolean;
  isCraft?: boolean;
  isQuest?: boolean;
}
