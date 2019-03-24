export type GameDefinition = {
  name: string;
  id: string;
  icon: string;
  fields: GameFieldDefinition[];
};
export type GameFieldDefinition = {
  id: string;
  name: string;
  type: "number" | "date" | "text";
  valuePerPlayer?: boolean; // defaults to true
  minValue?: number;
  maxValue?: number;
};
export type Player = {
  name: string;
  id: string;
};

const terraFormingMars: GameDefinition = {
  name: "Terraforming Mars",
  id: "1",
  icon: "",
  fields: [
    { id: "1", name: "Terraforming rating", type: "number", minValue: 0 },
    { id: "2", name: "Awards", type: "number", minValue: 0 },
    { id: "3", name: "Milestones", type: "number", minValue: 0 },
    { id: "4", name: "Game board", type: "number", minValue: 0 },
    {
      id: "5",
      name: "Generations",
      type: "number",
      minValue: 0,
      valuePerPlayer: false
    }
  ]
};

export const games = [terraFormingMars];

export const players = [
  { name: "Panu", id: "1" },
  { name: "Hanna", id: "2" },
  { name: "Kimmo", id: "3" },
  { name: "Hanna", id: "4" }
];
export type Scores = {
  gameId: string;
  scores: {
    playerId: string;
    fieldId: string;
    score: number;
  }[];
};
