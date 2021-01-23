import { GameDefinition, Game } from "./game";

const azul: GameDefinition = {
  name: "Azul",
  id: "azul",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/ql-0-t271LVGqbmWA1gdkIH7WvM=/fit-in/246x300/pic3718275.jpg",
  simultaneousTurns: false,
  scoreFields: [
    { id: "score-tracker", name: "Score tracker", type: "number", minValue: 0 },
    {
      id: "horizontal-lines",
      name: "Horizontal lines",
      type: "number",
      minValue: 0,
    },
    {
      id: "vertical-lines",
      name: "Vertical lines",
      type: "number",
      minValue: 0,
    },
    { id: "full-colours", name: "Full colors", type: "number", minValue: 0 },
  ],
};

const everdell: GameDefinition = {
  name: "Everdell",
  id: "everdell",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/WDbT-w4bNeIwxojLW92I_SO5GSU=/fit-in/246x300/pic3918905.png",
  simultaneousTurns: false,
  scoreFields: [
    { id: "cards", name: "Cards", type: "number", minValue: 0 },
    {
      id: "tokens",
      name: "Tokens",
      type: "number",
      minValue: 0,
    },
    {
      id: "prosperity",
      name: "Prosperity",
      type: "number",
      minValue: 0,
    },
    { id: "journey", name: "Journey", type: "number", minValue: 0 },
    { id: "events", name: "Events", type: "number", minValue: 0 },
  ],
};

const coup: GameDefinition = {
  name: "Coup",
  id: "Coup",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/iwjc_79Aqz3lMb6orn7XhDplgKc=/fit-in/246x300/pic2016054.jpg",
  simultaneousTurns: false,
  scoreFields: [
    {
      id: "is-winner",
      name: "Is winner",
      type: "number",
      minValue: 0,
      description: "1 for winner; 0 for the rest",
    },
  ],
};

const brass: GameDefinition = {
  name: "Brass",
  id: "brass",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/_U34-eDDAf5K8Ftc9JDAi9vr-dE=/fit-in/246x300/pic3490053.jpg",
  simultaneousTurns: false,
  scoreFields: [
    { id: "score-tracker", name: "Score tracker", type: "number", minValue: 0 },
  ],
  expansions: [
    {
      id: "birmingham",
      name: "Birmingham",
      scoreFields: [],
    },
  ],
};

const dominion: GameDefinition = {
  name: "Dominion",
  id: "dominion",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/7mkW_JrUx0PSa4Ame3zzsLE0BVY=/fit-in/246x300/pic394356.jpg",
  simultaneousTurns: false,
  scoreFields: [{ id: "scores", name: "Scores", type: "number" }],
};

const bohnanza: GameDefinition = {
  name: "Bohnanza",
  id: "bohnanza",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/_KP8uVds-gbz3-R08Y_JCO1Ovwg=/fit-in/246x300/pic69366.jpg",
  simultaneousTurns: false,
  scoreFields: [
    { id: "score-tracker", name: "Score tracker", type: "number", minValue: 0 },
  ],
};

const imperial: GameDefinition = {
  name: "Imperial",
  id: "imperial",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/JOFogK5y-tNJRGLMS-NlRYbm864=/fit-in/246x300/pic840712.jpg",
  simultaneousTurns: false,
  scoreFields: [
    {
      id: "austria-hungary",
      name: "Austria-Hungary",
      type: "number",
      minValue: 0,
    },
    { id: "italy", name: "Italy", type: "number", minValue: 0 },
    { id: "france", name: "France", type: "number", minValue: 0 },
    { id: "great-britain", name: "Great Britain", type: "number", minValue: 0 },
    { id: "germany", name: "Germany", type: "number", minValue: 0 },
    { id: "russia", name: "Russia", type: "number", minValue: 0 },
    { id: "money", name: "Money", type: "number", minValue: 0 },
  ],
};

const terraFormingMars: GameDefinition = {
  name: "Terraforming Mars",
  id: "terraforming-mars",
  icon:
    "https://cf.geekdo-images.com/imagepage/img/sgZLoyg3KKeHvyHel8tZ2TIkXRw=/fit-in/900x600/filters:no_upscale()/pic3536616.jpg",
  simultaneousTurns: false,
  scoreFields: [
    {
      id: "terraforming-rating",
      name: "Terraforming rating",
      type: "number",
      minValue: 0,
    },
    { id: "awards", name: "Awards", type: "number", minValue: 0 },
    { id: "milestones", name: "Milestones", type: "number", minValue: 0 },
    { id: "game-board", name: "Game board", type: "number", minValue: 0 },
    { id: "cards", name: "Cards", type: "number", minValue: 0 },
  ],
  miscFields: [
    {
      id: "corporation",
      name: "Corporation",
      type: "text",
      valuePerPlayer: true,
      isRelevantReportDimension: true,
      options: [
        { value: "Aridor", label: "Aridor" },
        { value: "Aphrodite", label: "Aphrodite" },
        { value: "Arklight", label: "Arklight" },
        { value: "Beginner", label: "Beginner" },
        { value: "Cheung Shing Mars", label: "Cheung Shing Mars" },
        { value: "Credicor", label: "Credicor" },
        { value: "Celestic", label: "Celestic" },
        { value: "Ecoline", label: "Ecoline" },
        { value: "Helion", label: "Helion" },
        { value: "Inventrix", label: "Inventrix" },
        {
          value: "Interplanetary cinematics",
          label: "Interplanetary cinematics",
        },
        { value: "Lakefront Resorts", label: "Lakefront Resorts" },
        { value: "Manutech", label: "Manutech" },
        { value: "Mining guild", label: "Mining guild" },
        { value: "Mons Insurance", label: "Mons Insurance" },
        { value: "Morning Star inc", label: "Morning Star inc" },
        { value: "Phoblog", label: "Phoblog" },
        { value: "Point Luna", label: "Point Luna" },
        { value: "Polyphemos", label: "Polyphemos" },
        { value: "Poseidon", label: "Poseidon" },
        { value: "Pristar", label: "Pristar" },
        { value: "Robinson Industries", label: "Robinson Industries" },
        { value: "Saturn systems", label: "Saturn systems" },
        { value: "Septem Tribus", label: "Septem Tribus" },
        { value: "Stormcraft", label: "Stormcraft" },
        { value: "Teractor", label: "Teractor" },
        { value: "Terralabs Research", label: "Terralabs Research" },
        { value: "Tharsis Republic", label: "Tharsis republic" },
        { value: "Thorgate", label: "Thorgate" },
        {
          value: "United nations Mars initiative",
          label: "United nations Mars initiative",
        },
        { value: "Utopia Invest", label: "Utopia Invest" },
        { value: "Valley Trust", label: "Valley Trust" },
        { value: "Viron", label: "Viron" },
        { value: "Vitor", label: "Vitor" },
      ],
    },
    { id: "generations", name: "Generations", type: "number", minValue: 0 },
  ],
  expansions: [
    {
      id: "advanced-cards",
      name: "Advanced cards",
    },
    {
      id: "prelude",
      name: "Prelude",
    },
    {
      id: "map-hellas",
      name: "Map: Hellas",
    },
    {
      id: "map-elysium",
      name: "Map: Elysium",
    },
    {
      id: "venus-next",
      name: "Venus Next",
    },
    {
      id: "colonies",
      name: "Colonies",
    },
    {
      id: "turmoil",
      name: "Turmoil",
      scoreFields: [
        {
          id: "politicians",
          name: "Politicians",
          type: "number",
          minValue: 0,
        },
      ],
    },
  ],
};

const sevenWonders: GameDefinition = {
  name: "7 Wonders",
  id: "7-wonders",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/fR5_q-7pMDmhLP8SPLOwPcUeLVo=/fit-in/246x300/pic860217.jpg",
  simultaneousTurns: true,
  scoreFields: [
    {
      id: "war",
      name: "War",
      type: "number",
    },
    { id: "money", name: "Money", type: "number" },
    { id: "wonders", name: "Wonders", type: "number", minValue: 0 },
    {
      id: "civil-buildings",
      name: "Civil buildings (blue)",
      type: "number",
      minValue: 0,
    },
    {
      id: "commercial-cards",
      name: "Commercial buildings (yellow)",
      type: "number",
      minValue: 0,
    },
    { id: "guilds", name: "Guilds (purple)", type: "number", minValue: 0 },
    {
      id: "science-buildings",
      name: "Science buildings (green)",
      type: "number",
      minValue: 0,
    },
  ],
  expansions: [
    {
      id: "leaders",
      name: "Leaders",
      scoreFields: [
        { id: "leaders", name: "Leaders", type: "number", minValue: 0 },
      ],
    },
    {
      id: "cities",
      name: "Cities",
      scoreFields: [
        {
          id: "city-buildings",
          name: "City buildings (black)",
          type: "number",
          minValue: 0,
        },
        { id: "debt", name: "Debt tokens", type: "number", maxValue: 0 },
      ],
    },
    {
      id: "armada",
      name: "Armada",
      scoreFields: [
        { id: "naval-war", name: "Naval war", type: "number" },
        {
          id: "island-cards",
          name: "Island cards",
          type: "number",
          minValue: 0,
        },
        { id: "dockyard", name: "Dockyard board", type: "number", minValue: 0 },
      ],
    },
  ],
};

const cavernaForgottenFolk: GameDefinition = {
  name: "Caverna",
  id: "caverna",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/QwBOuD-kVtDTkowpVQldIFv46m8=/fit-in/246x300/pic1790789.jpg",
  simultaneousTurns: false,
  scoreFields: [
    {
      id: "farm-animal-and-dog",
      name: "1p per farm animal and doge",
      type: "number",
      minValue: 0,
    },
    {
      id: "missing-farm-animal",
      name: "-2p per missing type of farm animal (-2)",
      type: "number",
      maxValue: 0,
    },
    {
      id: "per-grain",
      name: "1/2p per grain (rounded up)",
      type: "number",
      minValue: 0,
    },
    {
      id: "per-vegetable",
      name: "1p per vegetable",
      type: "number",
      minValue: 0,
    },
    { id: "per-ruby", name: "1p per ruby", type: "number", minValue: 0 },
    { id: "per-dwarf", name: "1p per dwarf", type: "number", minValue: 0 },
    {
      id: "per-unused-space",
      name: "-1p per unused space",
      type: "number",
      maxValue: 0,
    },
    {
      id: "game-board",
      name: "Furnishing tiles, pastures, mines",
      type: "number",
      minValue: 0,
    },
    {
      id: "score-game-board",
      name: "for parlors, storages and chambers",
      type: "number",
      minValue: 0,
    },
    {
      id: "gold-coins-and-begging-markers",
      name: "gold coins and begging markers",
      type: "number",
      minValue: 0,
    },
  ],
  miscFields: [
    {
      id: "variant-forgotten-folk",
      name: "Variant: Forgotten folk",
      type: "boolean",
      affectsScoring: true,
    },
    {
      id: "race",
      name: "Race (Only for Forgotten folk)",
      isRelevantReportDimension: true,
      type: "text",
      valuePerPlayer: true,
      options: [
        { value: "Pale ones", label: "Pale ones" },
        { value: "Humans", label: "Humans" },
        { value: "Cave goblins", label: "Cave goblins" },
        { value: "Dark elves", label: "Dark elves" },
        { value: "Elves", label: "Elves" },
        { value: "Mountain dwarves", label: "Mountain dwarves" },
        { value: "Silicoids", label: "Silicoids" },
        { value: "Trolls", label: "Trolls" },
      ],
    },
  ],
};

const eclipse: GameDefinition = {
  name: "Eclipse",
  id: "eclipse",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/Ng0wVwl4xSa-MeOpuMaq1f7EwDs=/fit-in/246x300/pic1974056.jpg",
  simultaneousTurns: false,
  scoreFields: [
    {
      id: "game-board",
      name: "Game board (only sectors)",
      type: "number",
      minValue: 0,
    },
    {
      id: "technology",
      name: "Technology track",
      type: "number",
      minValue: 0,
    },
    {
      id: "reputatio-tiles",
      name: "Reputation tiles",
      type: "number",
      minValue: 0,
    },
    {
      id: "ambassadors",
      name: "Ambassadors",
      type: "number",
      minValue: 0,
    },
    {
      id: "discovery-tiles",
      name: "Discovery tiles",
      type: "number",
      minValue: 0,
    },
    {
      id: "monoliths",
      name: "Monoliths",
      type: "number",
      minValue: 0,
    },
    {
      id: "other",
      name:
        "Other (like racial bonuses, development tiles, alliance points, traitor card)",
      type: "number",
      minValue: 0,
    },
  ],
  miscFields: [
    {
      id: "race",
      name: "Race",
      type: "text",
      valuePerPlayer: true,
      isRelevantReportDimension: true,
      options: [
        { value: "Descendants of Draco", label: "Descendants of Draco" },
        { value: "Eridani", label: "Eridani" },
        { value: "Exiles", label: "Exiles" },
        { value: "Hydrans", label: "Hydrans" },
        { value: "Lyrans", label: "Lyrans" },
        { value: "Magellan", label: "Magellan" },
        { value: "Mechanic", label: "Mechanic" },
        { value: "Octanis", label: "Octanis" },
        { value: "Orions", label: "Orions" },
        { value: "Planta", label: "Planta" },
        { value: "Pryxis", label: "Pryxis" },
        { value: "Rhi-No", label: "Rhi-No" },
        { value: "Shapers", label: "Shapers" },
        { value: "Terrans", label: "Terrans" },
      ],
    },
  ],
  expansions: [
    {
      id: "rise-of-the-ancients",
      name: "Rise of the Ancients",
    },
    {
      id: "shadow-of-the-rift",
      name: "Shadow of the Rift",
    },
  ],
};

const feastForOdin: GameDefinition = {
  name: "a Feast for Odin",
  id: "feast-for-odin",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/IAIxn2CB7l9cE5UPyXFx35bT5TA=/fit-in/246x300/pic3146943.png",
  simultaneousTurns: false,
  scoreFields: [
    { id: "ships", name: "Ships", type: "number", minValue: 0 },
    { id: "emigrations", name: "Emigrations", type: "number", minValue: 0 },
    {
      id: "exploration-boards",
      name: "Exploration boards",
      type: "number",
      minValue: 0,
    },
    {
      id: "sheds-and-houses",
      name: "Sheds and houses",
      type: "number",
      minValue: 0,
    },
    {
      id: "sheep-and-cattle",
      name: "Sheep and cattle",
      type: "number",
      minValue: 0,
    },
    { id: "occupations", name: "Occupations", type: "number", minValue: 0 },
    { id: "silver", name: "Silver", type: "number", minValue: 0 },
    { id: "final-income", name: "Final income", type: "number", minValue: 0 },
    { id: "english-crown", name: "English crown", type: "number", minValue: 0 },
    {
      id: "home-board",
      name: "Home board (negatives)",
      type: "number",
      maxValue: 0,
    },
    {
      id: "exploration-boards-negative",
      name: "Exploration boards (negatives)",
      type: "number",
      maxValue: 0,
    },
    {
      id: "sheds-and-houses-negative",
      name: "Sheds and houses (negatives)",
      type: "number",
      maxValue: 0,
    },
    { id: "thing-penalty", name: "Thing Penalty", type: "number", maxValue: 0 },
  ],
  miscFields: [
    { id: "rounds", name: "Rounds", type: "number", minValue: 6, maxValue: 7 },
  ],
};

const honshu: GameDefinition = {
  name: "Honshu",
  id: "honshu",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/l_uH7Py0YPsBK3L4Ti3x6Jswj2g=/fit-in/246x300/pic3627583.jpg",
  simultaneousTurns: false,
  scoreFields: [
    { id: "forests", name: "Forests", type: "number", minValue: 0 },
    { id: "city", name: "City", type: "number", minValue: 0 },
    { id: "factories", name: "Factories", type: "number", minValue: 0 },
    { id: "water", name: "Water", type: "number", minValue: 0 },
    { id: "bonus", name: "Bonus", type: "number", minValue: 0 },
  ],
  miscFields: [{ id: "bonusType", name: "Type of bonus", type: "text" }],
};

const terraMystica: GameDefinition = {
  name: "Terra Mystica",
  id: "terra-mystica",
  icon:
    "https://cf.geekdo-images.com/imagepage/img/JS90_q_U-h5Xe9Dn2jTTky-FqOs=/fit-in/900x600/filters:no_upscale()/pic1356616.jpg",
  simultaneousTurns: false,
  scoreFields: [
    { id: "points", name: "Points", type: "number", minValue: 0 },
    { id: "largestArea", name: "Largest ares", type: "number", minValue: 0 },
    { id: "cultists", name: "Cultist tracks", type: "number", minValue: 0 },
  ],
  miscFields: [
    {
      id: "race",
      name: "Race",
      type: "text",
      valuePerPlayer: true,
      isRelevantReportDimension: true,
      options: [
        { value: "Alchemists", label: "Alchemists" },
        { value: "Auren", label: "Auren" },
        { value: "Chaos Magicians", label: "Chaos Magicians" },
        { value: "Cultists", label: "Cultists" },
        { value: "Darklings", label: "Darklings" },
        { value: "Dwarves", label: "Dwarves" },
        { value: "Engineers", label: "Engineers" },
        { value: "Fakirs", label: "Fakirs" },
        { value: "Giants", label: "Giants" },
        { value: "Halflings", label: "Halflings" },
        { value: "Mermaids", label: "Mermaids" },
        { value: "Nomads", label: "Nomads" },
        { value: "Swarmlings", label: "Swarmlings" },
        { value: "Witches", label: "Witches" },
      ],
    },
  ],
};

const welcomeTo: GameDefinition = {
  name: "Welcome To…",
  id: "welcome-to",
  icon:
    "https://cf.geekdo-images.com/imagepage/img/yNrp9LGw_S1mt8ggsQx0OHn_4MA=/fit-in/900x600/filters:no_upscale()/pic3761012.jpg",
  simultaneousTurns: true,
  scoreFields: [
    { id: "plans", name: "City Plans", type: "number", minValue: 0 },
    { id: "parks", name: "Parks", type: "number", minValue: 0 },
    { id: "pools", name: "Pools", type: "number", minValue: 0 },
    { id: "temp-agency", name: "Temp agency", type: "number", minValue: 0 },
    {
      id: "housing-estates",
      name: "Housing estates (any size)",
      type: "number",
      minValue: 0,
    },
    { id: "bis", name: "Bis (negative)", type: "number", maxValue: 0 },
    {
      id: "roundabout",
      name: "Roundabouts (negative)",
      type: "number",
      maxValue: 0,
    },
    {
      id: "building-permit-refusal",
      name: "Building permit refusal (negative)",
      type: "number",
      maxValue: 0,
    },
  ],
  miscFields: [
    {
      id: "town-name",
      name: "Name of the town",
      type: "text",
      valuePerPlayer: true,
    },
  ],
};

const concordia: GameDefinition = {
  name: "Concordia",
  id: "concordia",
  icon:
    "https://cf.geekdo-images.com/imagepagezoom/img/irV1Ma7cZOkSHZLQvZqSXd75V5k=/fit-in/1200x900/filters:no_upscale()/pic3453267.jpg",
  simultaneousTurns: false,
  scoreFields: [
    {
      id: "vesta",
      name: "Vesta",
      description:
        "1 VP per full 10 sestertii, including the value of all goods in the storehouse",
      type: "number",
      minValue: 0,
    },
    {
      id: "jupiter",
      name: "Jupiter",
      description: "1 VP per card for each house inside a non-brick city",
      type: "number",
      minValue: 0,
    },
    {
      id: "saturnus",
      name: "Saturnus",
      description:
        "1 VP per card for each province with at least one of the player's houses",
      type: "number",
      minValue: 0,
    },
    {
      id: "mercurius",
      name: "Mercurius",
      description:
        "2 VP per card for each type of goods the player is producing",
      type: "number",
      minValue: 0,
    },
    {
      id: "mars",
      name: "Mars",
      description: "2 VP per card for each colonist on the game board",
      type: "number",
      minValue: 0,
    },
    {
      id: "minerva",
      name: "Minerva",
      description:
        "Certain number of VP per the specialist's card for each related city",
      type: "number",
      minValue: 0,
    },
    {
      id: "concordia",
      name: "Concordia",
      description: "Awarded to the player that ends the game",
      type: "number",
      options: [
        {
          value: 0,
          label: "Did not end the game (0 VP)",
        },
        {
          value: 7,
          label: "Ended the game (7 VP)",
        },
      ],
    },
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
    },
  ],
};

const dominantSpecies: GameDefinition = {
  name: "Dominant Species",
  id: "dominant-species",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/4hl4RAfGaZTrQ3EkB9isK2RTHPo=/fit-in/246x300/pic784193.jpg",
  simultaneousTurns: false,
  scoreFields: [
    {
      id: "score",
      name: "Scores",
      type: "number",
      minValue: 0,
    },
    {
      id: "ice-age",
      name: "Ice age",
      type: "number",
      minValue: 0,
    },
    {
      id: "end-scoring",
      name: "End scoring",
      type: "number",
      minValue: 0,
    },
  ],
  miscFields: [
    {
      id: "animal",
      name: "Animal",
      type: "text",
      isRelevantReportDimension: true,
      valuePerPlayer: true,
      options: [
        { value: "Mammals", label: "Mammals" },
        { value: "Reptiles", label: "Reptiles" },
        { value: "Birds", label: "Birds" },
        { value: "Amphibians", label: "Amphibians" },
        { value: "Arachnids", label: "Arachnids" },
        { value: "Insects", label: "Insects" },
      ],
    },
    {
      id: "variant-rules",
      name: "Variant",
      type: "text",
      affectsScoring: true,
      options: [
        {
          value: "Short game w/o all dominant cards",
          label: "Short game w/o all dominant cards",
        },
      ],
    },
  ],
};

const splendor: GameDefinition = {
  name: "Splendor",
  id: "splendor",
  icon:
    "https://cf.geekdo-images.com/imagepage/img/pUmqbocA9S9-E37EkgCHMAL_HJ0=/fit-in/900x600/filters:no_upscale()/pic1904079.jpg",
  simultaneousTurns: false,
  scoreFields: [
    {
      id: "production",
      name: "Production",
      type: "number",
      minValue: 0,
    },
    {
      id: "nobles",
      name: "Nobles",
      type: "number",
      minValue: 0,
    },
  ],
  miscFields: [],
};

const catan: GameDefinition = {
  name: "Catan",
  id: "catan",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/aozRplCSOpRucLxSuClX2odEUBQ=/fit-in/246x300/pic2419375.jpg",
  simultaneousTurns: false,
  scoreFields: [
    { id: "game-board", name: "Game board", type: "number", minValue: 0 },
    {
      id: "longest-road",
      name: "Longest road",
      type: "number",
      minValue: 0,
    },
    {
      id: "largest-army",
      name: "Largest army",
      type: "number",
      minValue: 0,
    },
    {
      id: "development-cards",
      name: "Development card victory points",
      type: "number",
      minValue: 0,
    },
  ],
};

const lordsOfWaterdeep: GameDefinition = {
  name: "Lords of Waterdeep",
  id: "lords-of-waterdeep",
  icon:
    "https://cf.geekdo-images.com/itemrep/img/VYYUbyIZHFJSUCS9Os2ndcV041k=/fit-in/246x300/pic1116080.jpg",
  simultaneousTurns: false,
  scoreFields: [
    { id: "scores", name: "Scores", type: "number", minValue: 0 },
    {
      id: "lord",
      name: "Lord",
      type: "number",
      minValue: 0,
    },
    {
      id: "leftover-resources",
      name: "Leftover resources",
      type: "number",
      minValue: 0,
    },
    {
      id: "corruption",
      name: "Corruption",
      type: "number",
      maxValue: 0,
    },
  ],
  miscFields: [
    {
      id: "variant-scoundrels-of-skullport",
      name: "Variant: used Scoundrels of Skullport",
      type: "boolean",
      affectsScoring: true,
    },
  ],
};

const wingspan: GameDefinition = {
  name: "Wingspan",
  id: "wingspan",
  icon:
    "https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__itemrep/img/DR7181wU4sHT6gn6Q1XccpPxNHg=/fit-in/246x300/filters:strip_icc()/pic4458123.jpg",
  simultaneousTurns: false,
  scoreFields: [
    { id: "birds", name: "Birds", type: "number", minValue: 0 },
    { id: "bonus-cards", name: "Bonus cards", type: "number", minValue: 0 },
    { id: "end-of-round-goals", name: "End-of-round goals", type: "number", minValue: 0 },
    { id: "eggs", name: "Eggs", type: "number", minValue: 0 },
    { id: "food-on-cards", name: "Food on cards", type: "number", minValue: 0 },
    { id: "tucked cards", name: "Tucked cards", type: "number", minValue: 0 },
  ]
};

const clankInSpace: GameDefinition = {
  name: "Clank! In! Space!",
  id: "clank-in-space",
  icon:
    "https://cf.geekdo-images.com/haDQw7X8Z0VOItfow9eDtg__imagepagezoom/img/msLW6RNU_mcHXEgNORFj-XNWXnU=/fit-in/1200x900/filters:no_upscale():strip_icc()/pic3720843.jpg",
  simultaneousTurns: false,
  scoreFields: [
    { id: "artifact", name: "Artifact", type: "number", minValue: 0, maxValue: 30, step: 5 },
    { id: "escape-pod", name: "Escape pod", type: "number", minValue: 0, maxValue: 20, step: 20 },
    { id: "major-secrets", name: "Major secrets", type: "number", minValue: 0 },
    { id: "minor-secrets", name: "Minor secrets", type: "number", minValue: 0 },
    { id: "market-items", name: "Market items", type: "number", minValue: 0 },
    { id: "credits", name: "Credits", type: "number", minValue: 0 },
    { id: "cards", name: "Cards", type: "number", minValue: 0 },
  ],
}

const generic: GameDefinition = {
  name: "Generic game",
  id: "generic",
  icon: "https://image.flaticon.com/icons/svg/906/906794.svg",
  simultaneousTurns: false,
  scoreFields: [
    { id: "category-1", name: "Category 1", type: "number", minValue: 0 },
    { id: "category-2", name: "Category 2", type: "number", minValue: 0 },
    { id: "category-3", name: "Category 3", type: "number", minValue: 0 },
    { id: "category-4", name: "Category 4", type: "number", minValue: 0 },
    { id: "category-5", name: "Category 5", type: "number", minValue: 0 },
    { id: "category-6", name: "Category 6", type: "number", minValue: 0 },
  ],
  miscFields: [
    { id: "game-name", name: "Game name", type: "text", valuePerPlayer: false },
    {
      id: "category-1-name",
      name: "Category 1 name",
      type: "text",
      valuePerPlayer: false,
    },
    {
      id: "category-2-name",
      name: "Category 2 name",
      type: "text",
      valuePerPlayer: false,
    },
    {
      id: "category-3-name",
      name: "Category 3 name",
      type: "text",
      valuePerPlayer: false,
    },
    {
      id: "category-4-name",
      name: "Category 4 name",
      type: "text",
      valuePerPlayer: false,
    },
    {
      id: "category-5-name",
      name: "Category 5 name",
      type: "text",
      valuePerPlayer: false,
    },
    {
      id: "category-6-name",
      name: "Category 6 name",
      type: "text",
      valuePerPlayer: false,
    },
    {
      id: "variants",
      name: "Used variants",
      type: "text",
      valuePerPlayer: false,
    },
  ],
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
  concordia,
  dominantSpecies,
  splendor,
  sevenWonders,
  brass,
  imperial,
  bohnanza,
  dominion,
  coup,
  catan,
  generic,
  lordsOfWaterdeep,
  everdell,
  wingspan,
  clankInSpace
];

export const games = gameDtos.map((g) => new Game(g));
