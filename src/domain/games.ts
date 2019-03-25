import { GameDefinition } from "./model";

const terraFormingMars: GameDefinition = {
  name: "Terraforming Mars",
  id: "terraforming-mars",
  icon:
    "https://cf.geekdo-images.com/imagepage/img/sgZLoyg3KKeHvyHel8tZ2TIkXRw=/fit-in/900x600/filters:no_upscale()/pic3536616.jpg",
  fields: [
    {
      id: "1",
      name: "Terraforming rating",
      type: "number",
      minValue: 0,
      valuePerPlayer: true
    },
    {
      id: "2",
      name: "Awards",
      type: "number",
      minValue: 0,
      valuePerPlayer: true
    },
    {
      id: "3",
      name: "Milestones",
      type: "number",
      minValue: 0,
      valuePerPlayer: true
    },
    {
      id: "4",
      name: "Game board",
      type: "number",
      minValue: 0,
      valuePerPlayer: true
    },
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
    {
      id: "karkit",
      name: "Karkkis",
      type: "number",
      minValue: 0,
      valuePerPlayer: true
    },
    {
      id: "game-board",
      name: "Game board",
      type: "number",
      minValue: 0,
      valuePerPlayer: true
    }
  ]
};

export const games = [terraFormingMars, eclipse];
