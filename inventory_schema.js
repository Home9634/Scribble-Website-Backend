const mongoose = require('mongoose')
const Characters = require('./json/characters.json')
let characters = {}
let characterMasteries = {}
for (let i = 0; i < Object.keys(Characters).length; i++) {
  characterMasteries[i] = { level: 0, amount: 0 }
  characters[i] = { amount: 0, position: 0 }
}

let masteries = {
  "Unique Characters": [0, 0],
  "Burnt Characters": [0, 0],
  "Wordl Wins": [0, 0],
  "Tic Wins": [0, 0]
}

const Achievements = {
  "0": { "name": 'Watch it burn', "description": 'Burn a character for the first time!', "rewards": { "money": 200 }, "owned": false, "owned": false },
  "1": { "name": "Collector", "description": `Get your first Gacha Character Mastery.`, "rewards": { "crystals": 1 }, "owned": false, "owned": false },
  "2": { "name": "Why isn't it shiny?", "description": `Get your first Gacha 5 star.`, "rewards": { "money": 500 }, "owned": false, "owned": false },
  "3": { "name": "And so it begins...", "description": `Gacha Roll for the first time`, "rewards": { "money": 100 }, "owned": false, "owned": false },
  "3": { "name": "Word", "description": `Get some Wordl Wins`, "rewards": { "money": 100 }, "owned": false, "owned": false }
}

const inventorySchema = new mongoose.Schema({
  userID: {
    type: mongoose.SchemaTypes.String,
    required: true
  },

  username: {
    type: mongoose.SchemaTypes.String,
    required: true
  },

  profile_picture: {
    type: mongoose.SchemaTypes.String,
    required: true
  },

  money: {
    type: mongoose.SchemaTypes.Number,
    required: false,
    default: 0
  },

  dark_money: {
    type: mongoose.SchemaTypes.Number,
    required: false,
    default: 0
  },

  characters: {
    type: mongoose.SchemaTypes.Object,
    required: false,
    default: characters
  },

  job: {
    type: mongoose.SchemaTypes.String,
    required: false,
    default: 'citizen'
  },

  worktime: {
    type: mongoose.SchemaTypes.Number,
    required: false,
    default: 0
  },

  dailytime: {
    type: mongoose.SchemaTypes.Number,
    required: false,
    default: 0
  },

  dailystreak: {
    type: mongoose.SchemaTypes.Number,
    required: false,
    default: 0
  },

  constructCores: {
    type: mongoose.SchemaTypes.Number,
    required: false,
    default: 0
  },

  jobs: {
    type: mongoose.SchemaTypes.Object,
    required: false,
    default: { "citizen": { "level": 0, "xp": 0, "tier": 1 }, "researcher": { "level": 0, "xp": 0, "tier": 1 }, "gambler": { "level": 0, "xp": 0, "tier": 1 }, "professor": { "level": 0, "xp": 0, "tier": 1 }, "farmer": { "level": 0, "xp": 0, "fertiliser": 0, "tier": 1 }, "merchant": { "level": 0, "xp": 0, "masteries": {}, "tier": 1 } }
  },

  generalLevel: {
    type: mongoose.SchemaTypes.Number,
    required: false,
    default: 0
  },

  generalXP: {
    type: mongoose.SchemaTypes.Number,
    required: false,
    default: 0
  },

  crystals: {
    type: mongoose.SchemaTypes.Number,
    required: false,
    default: 0
  },

  gamewins: {
    type: mongoose.SchemaTypes.Object,
    required: false,
    default: { "wordl": 0, "tic": 0, "doubledl": 0, "tripledl": 0, "tzfe": 0 }
  },

  gamescores: {
    type: mongoose.SchemaTypes.Object,
    required: false,
    default: { "tzfe": 0}
  },

  robRisk: {
    type: mongoose.SchemaTypes.Number,
    required: false,
    default: 90
  },

  robCooldown: {
    type: mongoose.SchemaTypes.Number,
    required: false,
    default: 0
  },

  characterMasteries: {
    type: mongoose.SchemaTypes.Object,
    required: false,
    default: characterMasteries
  },

  gems: {
    type: mongoose.SchemaTypes.Number,
    required: false,
    default: 0
  },

  inventory: {
    type: mongoose.SchemaTypes.Array,
    required: false,
    default: []
  },

  eggs: {
    type: mongoose.SchemaTypes.Number,
    required: false,
    default: 0
  },

  space: {
    type: mongoose.SchemaTypes.String,
    required: false,
    default: 'positive'
  },

  spaces: {
    type: mongoose.SchemaTypes.Array,
    required: false,
    default: ['positive']
  },

  boosts: {
    type: mongoose.SchemaTypes.Object,
    required: false,
    default: { "PSMoneyBoost": [], "PSXPBoost": [], "NSMoneyBoost": [], "NSXPBoost": [] } // PS is Positive Space, NS is Negative Spaces
  },

  quickRolling: {
    type: mongoose.SchemaTypes.Boolean,
    required: false,
    default: false
  },

  oldCharacters: {
    type: mongoose.SchemaTypes.Array,
    required: false,
    default: false
  },

  testCharacters: {
    type: mongoose.SchemaTypes.Object,
    required: false,
    default: characters
  },

  cooldowns: {
    type: mongoose.SchemaTypes.Object,
    required: false,
    default: {}
  },

  mailbox: {
    type: mongoose.SchemaTypes.Array,
    required: false,
    default: []
  },

  crystalDust: {
    type: mongoose.SchemaTypes.Number,
    required: false,
    default: 0
  },

  baits: {
    type: mongoose.SchemaTypes.Object,
    required: false,
    default: {}
  },

  stock: {
    type: mongoose.SchemaTypes.Object,
    required: false,
    default: {}
  },

  islands: {
    type: mongoose.SchemaTypes.Object,
    required: false,
    default: ["Main"]
  },

  location: {
    type: mongoose.SchemaTypes.String,
    required: false,
    default: "main-starter_hut" 
  },

  locations: {
    type: mongoose.SchemaTypes.Array,
    required: false,
    default: ["main-starter_hut"]
  },

  currencies: {
    type: mongoose.SchemaTypes.Object,
    required: false,
    defualt: {}
  },

  quests: {
    type: mongoose.SchemaTypes.Object,
    required: false,
    defualt: {
      "completed": [],
      "current": []
    }
  },

  npcs: {
    type: mongoose.SchemaTypes.Object,
    required: false,
    default: {
      "monger": {
        "last-topic": null,
        "next-topic": null,
        "seen-topics": []
      } 
    }
  } 


  //masteries : {
  //  type : mongoose.SchemaTypes.Object,
  //  required : false,
  //  default : {}
  //}
})

module.exports = mongoose.model('inventory', inventorySchema, 'inventory')
