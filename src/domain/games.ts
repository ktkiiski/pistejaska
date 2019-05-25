import { GameDefinition, Game } from "./game";

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

const cavernaForgottenFolk: GameDefinition = {
  name: "Caverna: Forgotten folk",
  id: "caverna-forgotten-folk",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/SaQK25k1xKaJxmNJlBmtwT1HrWo=/fit-in/246x300/pic4268584.jpg",
  scoreFields: [
    {
      id: "farm-animal-and-dog",
      name: "1p per farm animal and doge",
      minValue: 0
    },
    {
      id: "missing-farm-animal",
      name: "-2p per missing type of farm animal (-2)",
      maxValue: 0
    },
    { id: "per-grain", name: "1/2p per grain (rounded up)", minValue: 0 },
    { id: "per-vegetable", name: "1p per vegetable", minValue: 0 },
    { id: "per-ruby", name: "1p per ruby", minValue: 0 },
    { id: "per-dwarf", name: "1p per dwarf", minValue: 0 },
    { id: "per-unused-space", name: "-1p per unused space", maxValue: 0 },
    {
      id: "game-board",
      name: "Furnishing tiles, pastures, mines",
      minValue: 0
    },
    {
      id: "score-game-board",
      name: "for parlors, storages and chambers",
      minValue: 0
    },
    {
      id: "gold-coins-and-begging-markers",
      name: "gold coins and begging markers",
      minValue: 0
    }
  ],
  miscFields: [{ id: "race", name: "Race", type: "text", valuePerPlayer: true }]
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

const honshu: GameDefinition = {
  name: "Honshu",
  id: "honshu",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/l_uH7Py0YPsBK3L4Ti3x6Jswj2g=/fit-in/246x300/pic3627583.jpg",
  scoreFields: [
    { id: "forests", name: "Forests", minValue: 0 },
    { id: "city", name: "City", minValue: 0 },
    { id: "factories", name: "Factories", minValue: 0 },
    { id: "water", name: "Water", minValue: 0 },
    { id: "bonus", name: "Bonus", minValue: 0 }
  ],
  miscFields: [{ id: "bonusType", name: "Type of bonus", type: "text" }]
};

const terraMystica: GameDefinition = {
  name: "Terra Mystica",
  id: "terramystica",
  icon:
    "https://cf.geekdo-images.com/imagepage/img/JS90_q_U-h5Xe9Dn2jTTky-FqOs=/fit-in/900x600/filters:no_upscale()/pic1356616.jpg",
  scoreFields: [
    { id: "points", name: "Points", minValue: 0 },
    { id: "largestArea", name: "Largest ares", minValue: 0 },
    { id: "cultists", name: "Cultist tracks", minValue: 0 }
  ],
  miscFields: [{ id: "race", name: "Race", type: "text", valuePerPlayer: true }]
};

const gameDtos = [
  terraFormingMars,
  eclipse,
  feastForOdin,
  cavernaForgottenFolk,
  honshu,
  terraMystica
];

export const games = gameDtos.map(g => new Game(g));
