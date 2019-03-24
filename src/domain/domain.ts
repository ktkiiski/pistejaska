export type GameDefinition = {
  name: string;
  // please use human-readable, slugified ids, like "terraforming-mars"
  id: string;
  icon: string;
  fields: GameFieldDefinition[];
};
export type GameFieldDefinition = {
  // please use human-readable, slugified ids, like "terraforming-rating"
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
  id: "terraforming-mars",
  icon:
    "https://cf.geekdo-images.com/imagepage/img/sgZLoyg3KKeHvyHel8tZ2TIkXRw=/fit-in/900x600/filters:no_upscale()/pic3536616.jpg",
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

const eclipse: GameDefinition = {
  name: "Eclipse",
  id: "eclipse",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/Ng0wVwl4xSa-MeOpuMaq1f7EwDs=/fit-in/246x300/pic1974056.jpg",
  fields: [
    { id: "karkit", name: "Karkkis", type: "number", minValue: 0 },
    { id: "game-board", name: "Game board", type: "number", minValue: 0 }
  ]
};

export const games = [terraFormingMars, eclipse];

export type Scores = {
  gameId: string;
  scores: {
    playerId: string;
    fieldId: string;
    score: number;
  }[];
};
