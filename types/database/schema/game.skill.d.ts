export interface IGameSkill {
  id: string;
  name: string;
  type: string;
  characteristic: {
    rarity: string;
    dexterity: number;
    strength: number;
    endurance: number;
    concentration: number;
    intelligence: number;
    wisdom: number;
    spirit: number;
    luck: number;
    accuracy: number;
    mastery: number;
    attachment: number;
    eloquence: number;
    divinity: number;
    general_attack: number;
    damage: {
      physical: number;
      mage: number;
      mental: number;
    };
    recovery_hp: number;
    protection: {
      phesical: number;
      mage: number;
      mental: number;
    };
    cooldown_skill: string;
    stunning: string;
    working_hours: string;
    number_of_uses: string;
    restrictions: string;
    summon: {
      creature: string;
      max: number;
    };
  };
}
