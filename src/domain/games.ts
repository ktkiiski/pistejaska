import { GameDefinition, Game } from "./game";

const azul: GameDefinition = {
  name: "Azul",
  id: "azul",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/ql-0-t271LVGqbmWA1gdkIH7WvM=/fit-in/246x300/pic3718275.jpg",
  scoreFields: [
    { id: "score-tracker", name: "Score tracker", type: "number", minValue: 0 },
    { id: "horizontal-lines", name: "Horizontal lines", type: "number", minValue: 0 },
    { id: "vertical-lines", name: "Vertical lines", type: "number", minValue: 0 },
    { id: "full-colours", name: "Full colors", type: "number", minValue: 0 }
  ]
};

const terraFormingMars: GameDefinition = {
  name: "Terraforming Mars",
  id: "terraforming-mars",
  icon:
    "https://cf.geekdo-images.com/imagepage/img/sgZLoyg3KKeHvyHel8tZ2TIkXRw=/fit-in/900x600/filters:no_upscale()/pic3536616.jpg",
  scoreFields: [
    { id: "terraforming-rating", name: "Terraforming rating", type: "number", minValue: 0 },
    { id: "awards", name: "Awards", type: "number", minValue: 0 },
    { id: "milestones", name: "Milestones", type: "number", minValue: 0 },
    { id: "game-board", name: "Game board", type: "number", minValue: 0 },
    { id: "cards", name: "Cards", type: "number", minValue: 0 }
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
      type: "number",
      minValue: 0
    },
    {
      id: "missing-farm-animal",
      name: "-2p per missing type of farm animal (-2)",
      type: "number",
      maxValue: 0
    },
    { id: "per-grain", name: "1/2p per grain (rounded up)", type: "number", minValue: 0 },
    { id: "per-vegetable", name: "1p per vegetable", type: "number", minValue: 0 },
    { id: "per-ruby", name: "1p per ruby", type: "number", minValue: 0 },
    { id: "per-dwarf", name: "1p per dwarf", type: "number", minValue: 0 },
    { id: "per-unused-space", name: "-1p per unused space", type: "number", maxValue: 0 },
    {
      id: "game-board",
      name: "Furnishing tiles, pastures, mines",
      type: "number",
      minValue: 0
    },
    {
      id: "score-game-board",
      name: "for parlors, storages and chambers",
      type: "number",
      minValue: 0
    },
    {
      id: "gold-coins-and-begging-markers",
      name: "gold coins and begging markers",
      type: "number",
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
      type: "number",
      minValue: 0
    },
    {
      id: "game-board",
      name: "Game board",
      type: "number",
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
    { id: "ships", name: "Ships", type: "number", minValue: 0 },
    { id: "emigrations", name: "Emigrations", type: "number", minValue: 0 },
    { id: "exploration-boards", name: "Exploration boards", type: "number", minValue: 0 },
    { id: "sheds-and-houses", name: "Sheds and houses", type: "number", minValue: 0 },
    { id: "sheep-and-cattle", name: "Sheep and cattle", type: "number", minValue: 0 },
    { id: "occupations", name: "Occupations", type: "number", minValue: 0 },
    { id: "silver", name: "Silver", type: "number", minValue: 0 },
    { id: "final-income", name: "Final income", type: "number", minValue: 0 },
    { id: "english-crown", name: "English crown", type: "number", minValue: 0 },
    { id: "home-board", name: "Home board (negatives)", type: "number", maxValue: 0 },
    {
      id: "exploration-boards",
      name: "Exploration boards (negatives)",
      type: "number",
      maxValue: 0
    },
    {
      id: "sheds-and-houses",
      name: "Sheds and houses (negatives)",
      type: "number",
      maxValue: 0
    },
    { id: "thing-penalty", name: "Thing Penalty", type: "number", maxValue: 0 }
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
    { id: "forests", name: "Forests", type: "number", minValue: 0 },
    { id: "city", name: "City", type: "number", minValue: 0 },
    { id: "factories", name: "Factories", type: "number", minValue: 0 },
    { id: "water", name: "Water", type: "number", minValue: 0 },
    { id: "bonus", name: "Bonus", type: "number", minValue: 0 }
  ],
  miscFields: [{ id: "bonusType", name: "Type of bonus", type: "text" }]
};

const terraMystica: GameDefinition = {
  name: "Terra Mystica",
  id: "terramystica",
  icon:
    "https://cf.geekdo-images.com/imagepage/img/JS90_q_U-h5Xe9Dn2jTTky-FqOs=/fit-in/900x600/filters:no_upscale()/pic1356616.jpg",
  scoreFields: [
    { id: "points", name: "Points", type: "number", minValue: 0 },
    { id: "largestArea", name: "Largest ares", type: "number", minValue: 0 },
    { id: "cultists", name: "Cultist tracks", type: "number", minValue: 0 }
  ],
  miscFields: [{ id: "race", name: "Race", type: "text", valuePerPlayer: true }]
};

const welcomeTo: GameDefinition = {
  name: "Welcome To…",
  id: "welcome",
  icon:
    "https://cf.geekdo-images.com/imagepage/img/yNrp9LGw_S1mt8ggsQx0OHn_4MA=/fit-in/900x600/filters:no_upscale()/pic3761012.jpg",
  scoreFields: [
    { id: "plans", name: "City Plans", type: "number", minValue: 0 },
    { id: "parks", name: "Parks", type: "number", minValue: 0 },
    { id: "pools", name: "Pools", type: "number", minValue: 0 },
    { id: "temp-agency", name: "Temp agency", type: "number", minValue: 0 },
    { id: "housing-estates-1", name: "1-sized housing estates", type: "number", minValue: 0 },
    { id: "housing-estates-2", name: "2-sized housing estates", type: "number", minValue: 0 },
    { id: "housing-estates-3", name: "3-sized housing estates", type: "number", minValue: 0 },
    { id: "housing-estates-4", name: "4-sized housing estates", type: "number", minValue: 0 },
    { id: "housing-estates-5", name: "5-sized housing estates", type: "number", minValue: 0 },
    { id: "housing-estates-6", name: "6-sized housing estates", type: "number", minValue: 0 },
    { id: "bis", name: "Bis (negative)", type: "number", maxValue: 0 },
    { id: "roundabout", name: "Roundabouts (negative)", type: "number", maxValue: 0 },
    {
      id: "building-permit-refusal",
      name: "Building permit refusal (negative)",
      type: "number",
      maxValue: 0
    }
  ],
  miscFields: [
    {
      id: "town-name",
      name: "Name of the town",
      type: "text",
      valuePerPlayer: true
    }
  ]
};

const concordia: GameDefinition = {
  name: "Concordia",
  id: "concordia",
  icon:
    "https://cf.geekdo-images.com/imagepagezoom/img/irV1Ma7cZOkSHZLQvZqSXd75V5k=/fit-in/1200x900/filters:no_upscale()/pic3453267.jpg",
  scoreFields: [
    {
      id: "vesta",
      name: "Vesta",
      description:
        "1 VP per full 10 sestertii, including the value of all goods in the storehouse",
      type: "number",
      minValue: 0
    },
    {
      id: "jupiter",
      name: "Jupiter",
      description: "1 VP per card for each house inside a non-brick city",
    type: "number",
    minValue: 0
    },
    {
      id: "saturnus",
      name: "Saturnus",
      description:
        "1 VP per card for each province with at least one of the player's houses",
      type: "number",
      minValue: 0
    },
    {
      id: "mercurius",
      name: "Mercurius",
      description:
        "2 VP per card for each type of goods the player is producing",
      type: "number",
      minValue: 0
    },
    {
      id: "mars",
      name: "Mars",
      description: "2 VP per card for each colonist on the game board",
    type: "number",
    minValue: 0
    },
    {
      id: "minerva",
      name: "Minerva",
      description:
        "Certain number of VP per the specialist's card for each related city",
      type: "number",
      minValue: 0
    },
    {
      id: "concordia",
      name: "Concordia",
      description: "Awarded to the player that ends the game",
      type: "number",
      options: [{
        value: 0,
        label: "Did not end the game (0 VP)",
      }, {
        value: 7,
        label: "Ended the game (7 VP)",
      }],
    }
  ],
  miscFields: [
    {
      id: "map",
      name: "Map",
      type: "text",
      valuePerPlayer: false,
      description: "Which side of the board was used?",
      options: [
        { value: "Italy", label: "Italy" },
        { value: "Mediterranean", label: "Mediterranean" },
      ],
    }
  ]
};

const gameDtos = [
  terraFormingMars,
  eclipse,
  feastForOdin,
  cavernaForgottenFolk,
  honshu,
  terraMystica,
  azul,
  welcomeTo,
  concordia
];

export const games = gameDtos.map(g => new Game(g));
