export interface IGameRace {
  id: string;
  name: string;
  characteristic: {
    dexterity: number;
    strength: number;
    endurance: number;
    intelligence: number;
    spirit: number;
    eloquence: number;
    wisdom: number;
    luck: number;
    accuracy: number;
    mastery: number;
    attractiveness: number;
    divinity: number;
    concentration: number;
    total_amount: number;
  };
}
