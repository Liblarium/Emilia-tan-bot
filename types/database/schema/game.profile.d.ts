interface MaxNow {
  max: number;
  now: number
}

export interface IGameProfile {
  id: string;
  username: string;
  character: {
    name: string;
    age: number;
    race: string;
    class: string;
    appeal: string;
    gender: string;
    pedigree: string;
    titul: string;
    nobless_titul: string;
    level: number;
    health: MaxNow;
    mana: MaxNow;
    hunger: MaxNow;
    thirst: MaxNow;
    location: string;
    guild: string;
    profession: string;
    fraction: string;
    skill: number;
    balance: number;
    inventory: number;
    characteristic: {
      attack: number;
      strength: number;
      accuracy: number;
      precision: number;
      intelligence: number;
      wisdom: number;
      luck: number;
      defense: number;
      endurance: number;
      divinity: number;
      predisposition: number;
      concentration: number;
      dexterity: number;
      fatigue: number;
      injuries: string[];
    };
  };
}
