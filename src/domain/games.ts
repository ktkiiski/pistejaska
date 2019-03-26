import { GameDefinition, Game } from "./model";

const terraFormingMars: GameDefinition = {
  name: "Terraforming Mars",
  id: "terraforming-mars",
  icon:
    "https://cf.geekdo-images.com/imagepage/img/sgZLoyg3KKeHvyHel8tZ2TIkXRw=/fit-in/900x600/filters:no_upscale()/pic3536616.jpg",
  scoreFields: [
    { id: "terraforming-rating", name: "Terraforming rating", minValue: 0 },
    { id: "awards", name: "Awards", minValue: 0 },
    { id: "milestones", name: "Milestones", minValue: 0 },
    { id: "game-board", name: "Game board", minValue: 0 },
    { id: "cards", name: "Cards", minValue: 0 }
  ],
  miscFields: [
    { id: "generations", name: "Generations", type: "number", minValue: 0 }
  ]
};

const eclipse: GameDefinition = {
  name: "Eclipse",
  id: "eclipse",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/Ng0wVwl4xSa-MeOpuMaq1f7EwDs=/fit-in/246x300/pic1974056.jpg",
  scoreFields: [
    {
      id: "karkit",
      name: "Discovery tiles",
      minValue: 0
    },
    {
      id: "game-board",
      name: "Game board",
      minValue: 0
    }
  ]
};

const feastForOdin: GameDefinition = {
  name: "a Feast for Odin",
  id: "feast-for-odin",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/IAIxn2CB7l9cE5UPyXFx35bT5TA=/fit-in/246x300/pic3146943.png",
  scoreFields: [
    { id: "ships", name: "Ships", minValue: 0 },
    { id: "emigrations", name: "Emigrations", minValue: 0 },
    { id: "exploration-boards", name: "Exploration boards", minValue: 0 },
    { id: "sheds-and-houses", name: "Sheds and houses", minValue: 0 },
    { id: "sheep-and-cattle", name: "Sheep and cattle", minValue: 0 },
    { id: "occupations", name: "Occupations", minValue: 0 },
    { id: "silver", name: "Silver", minValue: 0 },
    { id: "final-income", name: "Final income", minValue: 0 },
    { id: "english-crown", name: "English crown", minValue: 0 },
    { id: "home-board", name: "Home board (negatives)", maxValue: 0 },
    {
      id: "exploration-boards",
      name: "Exploration boards (negatives)",
      maxValue: 0
    },
    {
      id: "sheds-and-houses",
      name: "Sheds and houses (negatives)",
      maxValue: 0
    },
    { id: "thing-penalty", name: "Thing Penalty", maxValue: 0 }
  ],
  miscFields: [
    { id: "rounds", name: "Rounds", type: "number", minValue: 6, maxValue: 7 }
  ]
};
const gameDtos = [terraFormingMars, eclipse, feastForOdin];

export const games = gameDtos.map(g => new Game(g));
