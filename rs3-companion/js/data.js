const XP_TABLE = [
    0, 83, 174, 276, 388, 512, 650, 801, 969, 1154, 1358, 1584, 1833, 2107, 2411, 2746, 3115, 3523, 3973, 4470, 5018, 5624, 6291, 7028, 7842, 8740, 9730, 10824, 12031, 13363, 14833, 16456, 18247, 20224, 22406, 24815, 27473, 30408, 33648, 37224, 41171, 45529, 50339, 55649, 61512, 67983, 75127, 83014, 91721, 101333, 111945, 123660, 136594, 150872, 166636, 184040, 203254, 224466, 247886, 273742, 302288, 333804, 368599, 407015, 449428, 496254, 547953, 605032, 668051, 737627, 814445, 899257, 992895, 1096278, 1210421, 1336443, 1475581, 1629200, 1798808, 1986068, 2192818, 2421087, 2673114, 2951373, 3258594, 3597792, 3972294, 4385776, 4842295, 5346332, 5902831, 6517253, 7195629, 7944614, 8771558, 9684577, 10692629, 11805606, 13034431
];

const SKILLS = [
    "Attack", "Strength", "Defence", "Ranged", "Prayer", "Magic", "Runecrafting", "Construction",
    "Dungeoneering", "Constitution", "Agility", "Herblore", "Thieving", "Crafting", "Fletching",
    "Slayer", "Hunting", "Divination", "Mining", "Smithing", "Fishing", "Cooking", "Firemaking",
    "Woodcutting", "Farming", "Summoning", "Invention", "Archaeology", "Necromancy"
];

const COMBAT_SKILLS = ["Attack", "Strength", "Defence", "Ranged", "Magic", "Constitution", "Prayer", "Summoning", "Necromancy"];

// Initial levels provided by the user
const INITIAL_USER_LEVELS = {
    "Attack": 62,
    "Strength": 52,
    "Defence": 60,
    "Ranged": 32,
    "Prayer": 43,
    "Magic": 40,
    "Runecrafting": 7,
    "Construction": 4,
    "Dungeoneering": 35,
    "Archaeology": 41,
    "Constitution": 57,
    "Agility": 3,
    "Herblore": 5,
    "Thieving": 5,
    "Crafting": 17,
    "Fletching": 31,
    "Slayer": 6,
    "Hunting": 3,
    "Divination": 10,
    "Necromancy": 1,
    "Mining": 23,
    "Smithing": 29,
    "Fishing": 4,
    "Cooking": 11,
    "Firemaking": 99,
    "Woodcutting": 57,
    "Farming": 5,
    "Summoning": 3,
    "Invention": 1
};

// Helper to create Wiki Link
const wiki = (text, page) => `<a href="https://runescape.wiki/w/${page || text}" target="_blank" class="wiki-link">${text}</a>`;

// Expanded training methods with Rich Descriptions
const TRAINING_METHODS = {
    "Attack": [
        {
            minLevel: 1, maxLevel: 30, method: "Trolls", xpRate: 15000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Trolls in the Burthorpe caves are the standard starter mob. They have low HP and respawn instantly.</p>
                <h3>Gear Setup</h3>
                <ul><li>Any starter melee weapon.</li></ul>
                <h3>Strategy</h3>
                <ol><li>Enter the cave north of Burthorpe.</li><li>Kill Trolls.</li></ol>
            `
        },
        {
            minLevel: 30, maxLevel: 50, method: "Rock Crabs", xpRate: 30000, type: "afk",
            description: `
                <h3>Overview</h3>
                <p>Rock Crabs have high HP and low defence, making them perfect for AFK training.</p>
                <h3>Requirements</h3>
                <ul><li>Access to ${wiki("Waterbirth Island")}.</li></ul>
                <h3>Strategy</h3>
                <ol><li>Run around to aggro them.</li><li>AFK until they stop attacking.</li><li>Run away and return to reset aggression.</li></ol>
            `
        },
        {
            minLevel: 50, maxLevel: 70, method: "Sand Crabs", xpRate: 50000, type: "afk",
            description: `
                <h3>Overview</h3>
                <p>Similar to Rock Crabs but with better stats. Located in Hosidius.</p>
                <h3>Strategy</h3>
                <ol><li>Pay 10k to travel to Crabclaw Isle for a less crowded spot.</li><li>AFK with auto-retaliate on.</li></ol>
            `
        },
        {
            minLevel: 70, maxLevel: 99, method: "Abyssal Demons", xpRate: 400000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>One of the best mid-high level training spots. Great XP and profit.</p>
                <h3>Requirements</h3>
                <ul><li>85 ${wiki("Slayer")}.</li></ul>
                <h3>Gear Setup</h3>
                <ul><li>${wiki("Noxious scythe")} or ${wiki("Dragon rider lance")} (Halberd range is key).</li><li>${wiki("Bandos armour")} or better.</li></ul>
                <h3>Strategy</h3>
                <ol><li>Go to the top of the Slayer Tower.</li><li>Use AoE abilities (${wiki("Hurricane")}, ${wiki("Quake")}).</li><li>Use ${wiki("Aggression potion")} for full AFK.</li></ol>
            `
        }
    ],
    "Mining": [
        {
            minLevel: 1, maxLevel: 30, method: "Copper/Tin/Iron", xpRate: 15000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Standard power mining. Mine and drop.</p>
                <h3>Strategy</h3>
                <ol><li>Mine Copper/Tin to 15.</li><li>Mine Iron to 30.</li><li>Use the ${wiki("Ore box")} to store ore if you want to bank.</li></ol>
            `
        },
        {
            minLevel: 30, maxLevel: 89, method: "Power Mining (Coal -> Banite)", xpRate: 60000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Mine the highest level ore available. Prioritize XP over keeping the ore.</p>
                <h3>Gear Setup</h3>
                <ul><li>Best ${wiki("Pickaxe")}.</li><li>${wiki("Mining urns")}.</li></ul>
                <h3>Strategy</h3>
                <ol><li>Coal (30), Adamant (40), Rune (50), Orichalcite (60), Necrite (70), Banite (80).</li><li>Click rock when sparkles appear for critical XP.</li></ol>
            `
        },
        {
            minLevel: 89, maxLevel: 99, method: "Seren Stones", xpRate: 250000, type: "afk",
            description: `
                <h3>Overview</h3>
                <p>The ultimate AFK mining method. No banking required.</p>
                <h3>Requirements</h3>
                <ul><li>${wiki("Plague's End")} quest.</li></ul>
                <h3>Gear Setup</h3>
                <ul><li>${wiki("Pickaxe of Earth and Song")}.</li><li>${wiki("Grace of the elves")} (optional).</li></ul>
                <h3>Strategy</h3>
                <ol><li>Click a stone in the Trahaearn district.</li><li>Drink ${wiki("Perfect juju mining potion")} for 100% stamina.</li><li>AFK for 5 mins.</li></ol>
            `
        }
    ],
    "Necromancy": [
        {
            minLevel: 1, maxLevel: 20, method: "Tutorial & Trolls", xpRate: 10000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Complete the tutorial and kill basic mobs to get a feel for the combat.</p>
                <h3>Strategy</h3>
                <ol><li>Complete the ${wiki("Necromancy!")} quest.</li><li>Kill Trolls in Burthorpe to practice building Necrosis stacks.</li></ol>
            `
        },
        {
            minLevel: 20, maxLevel: 60, method: "City of Um Tasks", xpRate: 50000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Focus on unlocking talents and upgrading gear.</p>
                <h3>Strategy</h3>
                <ol><li>Perform ${wiki("Rituals")} to get Souls.</li><li>Unlock Tier 1 and Tier 2 talents.</li><li>Upgrade your Death Guard and Lantern at the forge.</li></ol>
            `
        },
        {
            minLevel: 60, maxLevel: 90, method: "Hermod / Rituals", xpRate: 200000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Farm the boss ${wiki("Hermod")} for plates to upgrade armour, or do rituals for XP.</p>
                <h3>Strategy</h3>
                <ol><li>Kill Hermod for ${wiki("Hermodic plate")}s.</li><li>Use plates to craft T70/T80/T90 Power armour.</li></ol>
            `
        },
        {
            minLevel: 90, maxLevel: 99, method: "Rituals (Disturbances)", xpRate: 1000000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>High-intensity ritual farming chasing disturbances.</p>
                <h3>Requirements</h3>
                <ul><li>${wiki("Powerful memento")}s.</li></ul>
                <h3>Strategy</h3>
                <ol><li>Start Powerful Commune ritual.</li><li>Click every Disturbance (Sparkles, Horrors, Pools).</li><li>Massive XP rates.</li></ol>
            `
        }
    ],
    "Fishing": [
        {
            minLevel: 1, maxLevel: 20, method: "Crayfish", xpRate: 10000, type: "afk",
            description: `
                <h3>Overview</h3>
                <p>Fast catch rate, very close to bank/drop.</p>
                <h3>Strategy</h3>
                <ol><li>Fish Crayfish in Burthorpe.</li><li>Drop them.</li></ol>
            `
        },
        {
            minLevel: 20, maxLevel: 70, method: "Fly Fishing", xpRate: 50000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Trout and Salmon offer the best XP until high levels.</p>
                <h3>Strategy</h3>
                <ol><li>Fly fish at Shilo Village or Barbarian Village.</li><li>Use action bar to drop fish instantly.</li></ol>
            `
        },
        {
            minLevel: 70, maxLevel: 93, method: "Swarm Fishing", xpRate: 120000, type: "afk",
            description: `
                <h3>Overview</h3>
                <p>Deep Sea Fishing hub. Catches various fish, very AFK.</p>
                <h3>Gear Setup</h3>
                <ul><li>${wiki("Shark outfit")}.</li><li>${wiki("Call of the Sea")} aura.</li></ul>
                <h3>Strategy</h3>
                <ol><li>Fish from the Swarm spot.</li><li>Bank catches in the magical net nearby.</li></ol>
            `
        },
        {
            minLevel: 93, maxLevel: 99, method: "Waterfall Fishing", xpRate: 200000, type: "afk",
            description: `
                <h3>Overview</h3>
                <p>Best AFK fishing XP in the game.</p>
                <h3>Requirements</h3>
                <ul><li>${wiki("Prifddinas")} access.</li><li>90 Agility/Ranged/Strength to access high spots.</li></ul>
                <h3>Strategy</h3>
                <ol><li>Fish Crystal Urchins.</li><li>Convert them to XP in the shop (do not buy rewards).</li></ol>
            `
        }
    ],
    "Herblore": [
        {
            minLevel: 1, maxLevel: 99, method: "Potions", xpRate: 300000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Make the highest level potion available. It's expensive but fast.</p>
                <h3>Gear Setup</h3>
                <ul><li>${wiki("Portable well")} (W84 Lumbridge).</li><li>${wiki("Botanist's outfit")}.</li><li>${wiki("Brooch of the Gods")}.</li></ul>
                <h3>Strategy</h3>
                <ol><li>Attack potions (3) -> Strength potions (12) -> Defence potions (30) -> Ranging potions (72) -> Saradomin brews (81) -> Overloads (96).</li><li>Always use a Portable Well to save 10% ingredients and get 10% more XP.</li></ol>
            `
        }
    ],
    "Thieving": [
        {
            minLevel: 1, maxLevel: 62, method: "Pickpocketing", xpRate: 40000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Standard pickpocketing.</p>
                <h3>Strategy</h3>
                <ol><li>Men/Women (1-5).</li><li>Bakery Stalls (5-25).</li><li>Guards (25-62).</li></ol>
            `
        },
        {
            minLevel: 62, maxLevel: 90, method: "Safecracking", xpRate: 400000, type: "afk",
            description: `
                <h3>Overview</h3>
                <p>Insane XP rates and very AFK.</p>
                <h3>Requirements</h3>
                <ul><li>${wiki("Thieves' Guild")} capers.</li></ul>
                <h3>Strategy</h3>
                <ol><li>Crack safes in the Guild.</li><li>Rotate to safes in Wildy (high risk, high reward) or other cities.</li></ol>
            `
        },
        {
            minLevel: 90, maxLevel: 99, method: "Crux Eqal Knights", xpRate: 800000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Zero fail rate with the right setup.</p>
                <h3>Gear Setup</h3>
                <ul><li>${wiki("Master camouflage outfit")}.</li><li>${wiki("Ardougne cloak 4")}.</li><li>${wiki("Crystal mask")} spell.</li></ul>
                <h3>Strategy</h3>
                <ol><li>Pickpocket Knights in the Garden of Kharid.</li><li>Spam click.</li></ol>
            `
        }
    ],
    "Woodcutting": [
        {
            minLevel: 1, maxLevel: 68, method: "Standard Trees", xpRate: 40000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Cut and drop.</p>
                <h3>Strategy</h3>
                <ol><li>Normal Trees (1-15).</li><li>Oak (15-30).</li><li>Willow (30-68) in Draynor.</li></ol>
            `
        },
        {
            minLevel: 68, maxLevel: 94, method: "Ivy", xpRate: 80000, type: "afk",
            description: `
                <h3>Overview</h3>
                <p>Great AFK method, no logs to drop.</p>
                <h3>Strategy</h3>
                <ol><li>Chop Ivy on Varrock North Wall or Castle Wars.</li><li>Use ${wiki("Woodcutting urns")}.</li></ol>
            `
        },
        {
            minLevel: 94, maxLevel: 99, method: "Crystal Trees", xpRate: 120000, type: "afk",
            description: `
                <h3>Overview</h3>
                <p>High level AFK training.</p>
                <h3>Requirements</h3>
                <ul><li>${wiki("Prifddinas")}.</li></ul>
                <h3>Strategy</h3>
                <ol><li>Find the active Crystal Tree (teleport via portal).</li><li>Chop.</li></ol>
            `
        }
    ],
    "Runecrafting": [
        {
            minLevel: 1, maxLevel: 90, method: "Runespan", xpRate: 80000, type: "afk",
            description: `
                <h3>Overview</h3>
                <p>The best way to train RC without running to altars.</p>
                <h3>Strategy</h3>
                <ol><li>Enter Runespan.</li><li>Siphon nodes.</li><li>Move to higher floors at 33 and 50.</li><li>Hunt the Yellow Wizard for XP drops.</li></ol>
            `
        },
        {
            minLevel: 90, maxLevel: 99, method: "Soul Runes", xpRate: 350000, type: "afk",
            description: `
                <h3>Overview</h3>
                <p>Massive XP, very AFK charging phase.</p>
                <h3>Requirements</h3>
                <ul><li>${wiki("Phite Club")} quest.</li></ul>
                <h3>Strategy</h3>
                <ol><li>Charge the Soul Altar (2.5 mins AFK).</li><li>Craft runes.</li><li>Repeat.</li></ol>
            `
        }
    ],
    "Construction": [
        {
            minLevel: 1, maxLevel: 99, method: "Construction Contracts", xpRate: 150000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Cheaper and less click-intensive than POH building.</p>
                <h3>Strategy</h3>
                <ol><li>Accept contract.</li><li>Teleport to house.</li><li>Build furniture.</li><li>Return to complete.</li></ol>
            `
        }
    ],
    "Agility": [
        {
            minLevel: 1, maxLevel: 77, method: "Courses", xpRate: 40000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Run laps.</p>
                <h3>Strategy</h3>
                <ol><li>Burthorpe (1-18).</li><li>Watchtower (18-30).</li><li>Barbarian (30-52).</li><li>Wilderness (52-77) with ${wiki("Demonic skull")}.</li></ol>
            `
        },
        {
            minLevel: 77, maxLevel: 99, method: "Hefin Course", xpRate: 100000, type: "afk",
            description: `
                <h3>Overview</h3>
                <p>Very relaxed course in Prifddinas.</p>
                <h3>Strategy</h3>
                <ol><li>Position mouse in one spot.</li><li>Click rhythmically. The camera auto-rotates.</li></ol>
            `
        }
    ],
    "Archaeology": [
        {
            minLevel: 1, maxLevel: 120, method: "Excavation", xpRate: 100000, type: "afk",
            description: `
                <h3>Overview</h3>
                <p>Follow the linear progression of spots.</p>
                <h3>Gear Setup</h3>
                <ul><li>${wiki("Mattock of Time and Space")}.</li><li>${wiki("Grace of the elves")}.</li><li>${wiki("Auto-screener")}.</li></ul>
                <h3>Strategy</h3>
                <ol><li>Excavate highest level spot.</li><li>Restore artifacts for big XP drops.</li><li>Complete collections for tetracompasses.</li></ol>
            `
        }
    ],
    "Divination": [
        {
            minLevel: 1, maxLevel: 70, method: "Wisps", xpRate: 30000, type: "afk",
            description: `
                <h3>Overview</h3>
                <p>Harvest wisps and deposit memories.</p>
                <h3>Strategy</h3>
                <ol><li>Go to highest level colony.</li><li>Harvest wisps.</li><li>Deposit into rift.</li></ol>
            `
        },
        {
            minLevel: 70, maxLevel: 99, method: "Hall of Memories", xpRate: 120000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Community training method.</p>
                <h3>Strategy</h3>
                <ol><li>Join 'Corehunting' FC.</li><li>Harvest from core pillars.</li><li>Capture spirits.</li></ol>
            `
        }
    ],
    "Farming": [
        {
            minLevel: 1, maxLevel: 99, method: "Player Owned Farm", xpRate: 200000, type: "afk",
            description: `
                <h3>Overview</h3>
                <p>Passive XP. Check once a day.</p>
                <h3>Strategy</h3>
                <ol><li>Raise animals (Chickens -> Sheep -> Cows -> Dragons).</li><li>Check health/growth daily for massive XP drops.</li><li>Scoop poop for compost.</li></ol>
            `
        }
    ],
    "Hunter": [
        {
            minLevel: 1, maxLevel: 75, method: "Standard Hunting", xpRate: 60000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Bird snares and Box traps.</p>
                <h3>Strategy</h3>
                <ol><li>Crimson Swifts (1-29).</li><li>Salamanders (29-60).</li><li>Red Chinchompas (60-75).</li></ol>
            `
        },
        {
            minLevel: 75, maxLevel: 99, method: "Big Game Hunter", xpRate: 300000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Boss-like skilling encounter on Anachronia.</p>
                <h3>Strategy</h3>
                <ol><li>Bait the dinosaur.</li><li>Build traps.</li><li>Skin for loot. Great XP and money.</li></ol>
            `
        }
    ],
    "Invention": [
        {
            minLevel: 1, maxLevel: 120, method: "Combat/Skilling", xpRate: 500000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Train Invention passively while doing Combat, Mining, or Fishing.</p>
                <h3>Strategy</h3>
                <ol><li>Augment your weapon/armour/tool.</li><li>Train the skill until item level 12.</li><li>Siphon the item (gives XP, keeps item).</li><li>Repeat.</li></ol>
            `
        }
    ],
    "Slayer": [
        {
            minLevel: 1, maxLevel: 99, method: "Tasks", xpRate: 100000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Kill assigned monsters.</p>
                <h3>Gear Setup</h3>
                <ul><li>${wiki("Slayer helmet")} (Essential).</li></ul>
                <h3>Strategy</h3>
                <ol><li>Get task from highest level master (Laniakea/Mandrith).</li><li>Use specific weakness gear.</li><li>Block bad tasks (high effort/low XP).</li></ol>
            `
        }
    ],
    "Smithing": [
        {
            minLevel: 1, maxLevel: 99, method: "Burial Armour", xpRate: 400000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Fastest XP but consumes bars.</p>
                <h3>Requirements</h3>
                <ul><li>${wiki("Artisans' Workshop")}.</li></ul>
                <h3>Strategy</h3>
                <ol><li>Make Elder Rune Burial Armour sets.</li><li>Use ${wiki("Luminite injector")}s.</li></ol>
            `
        }
    ],
    "Cooking": [
        {
            minLevel: 1, maxLevel: 99, method: "Fish", xpRate: 300000, type: "afk",
            description: `
                <h3>Overview</h3>
                <p>Cook raw fish.</p>
                <h3>Gear Setup</h3>
                <ul><li>${wiki("Cooking gauntlets")}.</li><li>${wiki("Portable range")}.</li></ul>
                <h3>Strategy</h3>
                <ol><li>Cook highest level fish available.</li><li>Use Portable Range for extra XP and chance to save food.</li></ol>
            `
        }
    ],
    "Firemaking": [
        {
            minLevel: 1, maxLevel: 99, method: "Bonfires", xpRate: 300000, type: "afk",
            description: `
                <h3>Overview</h3>
                <p>Add logs to a fire.</p>
                <h3>Strategy</h3>
                <ol><li>Use ${wiki("Portable brazier")} (W84).</li><li>Add logs.</li><li>Use ${wiki("Pitch can")} for line firemaking if you want more active/faster XP.</li></ol>
            `
        }
    ],
    "Crafting": [
        {
            minLevel: 1, maxLevel: 75, method: "Gems/Leather", xpRate: 100000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Cut gems or craft leather.</p>
                <h3>Strategy</h3>
                <ol><li>Cut Sapphires/Emeralds/Rubies/Diamonds.</li><li>Craft Dragonhide bodies.</li></ol>
            `
        },
        {
            minLevel: 75, maxLevel: 99, method: "Prifddinas Harps", xpRate: 50000, type: "afk",
            description: `
                <h3>Overview</h3>
                <p>Free, AFK crafting XP.</p>
                <h3>Strategy</h3>
                <ol><li>Play harps in Ithell district.</li><li>Tune harp when it goes out of tune (50% or less).</li></ol>
            `
        }
    ],
    "Fletching": [
        {
            minLevel: 1, maxLevel: 55, method: "Bows", xpRate: 40000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Fletch logs into bows.</p>
                <h3>Strategy</h3>
                <ol><li>Shortbows -> Oak -> Willow -> Maple.</li></ol>
            `
        },
        {
            minLevel: 55, maxLevel: 99, method: "Broad Arrows", xpRate: 400000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Very fast, expensive.</p>
                <h3>Requirements</h3>
                <ul><li>${wiki("Broad arrowheads")} (Buy from Slayer masters).</li></ul>
                <h3>Strategy</h3>
                <ol><li>Fletch Broad Arrows.</li><li>Note: You cannot sell the finished arrows.</li></ol>
            `
        }
    ],
    "Dungeoneering": [
        {
            minLevel: 1, maxLevel: 99, method: "Floors", xpRate: 200000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Explore Daemonheim.</p>
                <h3>Strategy</h3>
                <ol><li>Rush C1 small floors for low floors.</li><li>Do C6 large floors for high floors (Occult/Warped).</li><li>Reset prestige when all floors are checked off.</li></ol>
            `
        }
    ],
    "Constitution": [
        {
            minLevel: 1, maxLevel: 99, method: "Combat", xpRate: 0, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Levels automatically while training Attack, Strength, Defence, Magic, Ranged, or Necromancy.</p>
            `
        }
    ],
    "Strength": [
        {
            minLevel: 1, maxLevel: 99, method: "Combat", xpRate: 400000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Train with Melee.</p>
                <h3>Strategy</h3>
                <ol><li>See <strong>Attack</strong> guide for mobs (Trolls -> Rock Crabs -> Abyssal Demons).</li><li>Select "Strength" XP in combat settings.</li></ol>
            `
        }
    ],
    "Defence": [
        {
            minLevel: 1, maxLevel: 99, method: "Combat", xpRate: 400000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Train with any combat style.</p>
                <h3>Strategy</h3>
                <ol><li>See <strong>Attack</strong> guide for mobs.</li><li>Select "Defence" XP in combat settings.</li><li>Alternatively, use ${wiki("Defensive abilities")} to stall adrenaline.</li></ol>
            `
        }
    ],
    "Ranged": [
        {
            minLevel: 1, maxLevel: 99, method: "Combat", xpRate: 400000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Train with Bows/Crossbows.</p>
                <h3>Strategy</h3>
                <ol><li>Trolls (1-30).</li><li>Rock Crabs (30-50).</li><li>Waterfiends (50-80).</li><li>Mechanised Chinchompas in Abyss (80-99).</li></ol>
            `
        }
    ],
    "Magic": [
        {
            minLevel: 1, maxLevel: 99, method: "Combat", xpRate: 400000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Train with Spells.</p>
                <h3>Strategy</h3>
                <ol><li>Trolls (1-30).</li><li>Rock Crabs (30-50).</li><li>Exiled Kalphites (50-70).</li><li>ED3 Trash Runs (70-99).</li></ol>
            `
        }
    ],
    "Prayer": [
        {
            minLevel: 1, maxLevel: 99, method: "Bones/Ashes", xpRate: 500000, type: "active",
            description: `
                <h3>Overview</h3>
                <p>Offer bones to an altar.</p>
                <h3>Strategy</h3>
                <ol><li>Use ${wiki("Dragon bones")} or ${wiki("Dinosaur bones")}.</li><li>Offer at Gilded Altar (POH) or Chaos Altar (Wildy).</li><li>Use ${wiki("Powder of burials")} to bury bones anywhere for 250% XP.</li></ol>
            `
        }
    ]
};

function getXpForLevel(level) {
    if (level < 1) return 0;
    if (level > 99) return XP_TABLE[98];
    return XP_TABLE[level - 1];
}


// Quest Database (Expanded with Key Progression & Unlocks)
const QUEST_DATA = [
    // --- Grandmaster / Endgame ---
    {
        id: "plagues_end",
        name: "Plague's End",
        description: "Unlocks Prifddinas, the high-level elf city. Essential for endgame skilling (Crystal Trees, Harps, Stones).",
        requirements: {
            levels: { "Agility": 75, "Construction": 75, "Crafting": 75, "Dungeoneering": 75, "Herblore": 75, "Mining": 75, "Prayer": 75, "Ranged": 75, "Summoning": 75, "Woodcutting": 75 },
            quests: ["Making History", "Catapult Construction", "Within the Light"]
        },
        wiki: "Plague%27s_End"
    },
    {
        id: "temple_senntisten",
        name: "The Temple at Senntisten",
        description: "Unlocks Ancient Curses (Soul Split, Turmoil). Critical for high-level combat sustain and DPS.",
        requirements: {
            levels: { "Prayer": 50, "Slayer": 1 },
            quests: ["Desert Treasure I", "Devious Minds", "The Curse of Arrav"]
        },
        wiki: "The_Temple_at_Senntisten"
    },
    {
        id: "world_wakes",
        name: "The World Wakes",
        description: "Unlocks Ultimate abilities (Sunshine, Death's Swiftness, Natural Instinct). No hard reqs for quest, but reqs needed for full rewards.",
        requirements: {
            levels: { "Slayer": 80, "Defence": 70, "Prayer": 70, "Firemaking": 74, "Magic": 80 }, // Full reward reqs
            quests: ["Ritual of the Mahjarrat", "The Firemaker's Curse", "Branches of Darkmeyer", "The Void Stares Back", "The Chosen Commander"]
        },
        wiki: "The_World_Wakes"
    },
    {
        id: "fate_of_gods",
        name: "Fate of the Gods",
        description: "Unlocks the Shard of Zaros (aggression mitigation) and Nihil/Muspah slayer tasks.",
        requirements: {
            levels: { "Magic": 75, "Divination": 75, "Slayer": 67, "Agility": 73, "Summoning": 67 },
            quests: ["Missing, Presumed Death"]
        },
        wiki: "Fate_of_the_Gods"
    },
    {
        id: "sliske_endgame",
        name: "Sliske's Endgame",
        description: "Grandmaster finale. Unlocks the Combined Catalyst fragment and reliable Barrows Brothers set effects.",
        requirements: {
            levels: { "Agility": 80, "Defence": 80, "Farming": 80, "Herblore": 80, "Hunter": 80, "Magic": 80, "Mining": 80, "Thieving": 80, "Woodcutting": 80 },
            quests: ["Kindred Spirits", "Nomad's Elegy", "One of a Kind", "Death of Chivalry"]
        },
        wiki: "Sliske%27s_Endgame"
    },
    {
        id: "extinction",
        name: "Extinction",
        description: "Unlocks the passive Ring of Vigour effect and high-tier skilling areas (Dream of Iaia).",
        requirements: {
            levels: { "Archaeology": 90, "Divination": 80, "Agility": 75, "Crafting": 75, "Herblore": 75, "Smithing": 75 },
            quests: ["Eye of Het II"]
        },
        wiki: "Extinction"
    },
    {
        id: "ritual_mahjarrat",
        name: "Ritual of the Mahjarrat",
        description: "Key lore quest. Unlocks Glacors, Bane ammo usage, and serves as a req for many other GMs.",
        requirements: {
            levels: { "Agility": 77, "Crafting": 76, "Mining": 76, "Magic": 77 },
            quests: ["The Temple at Senntisten", "While Guthix Sleeps", "Fight Arena", "Hazeel Cult", "Enakhra's Lament", "The Slug Menace", "A Tail of Two Cats"]
        },
        wiki: "Ritual_of_the_Mahjarrat"
    },
    {
        id: "while_guthix_sleeps",
        name: "While Guthix Sleeps",
        description: "Classic Grandmaster. Unlocks Tormented Demons and Dragon Platebody crafting.",
        requirements: {
            levels: { "Summoning": 65, "Farming": 65, "Herblore": 65, "Archaeology": 15, "Thieving": 60, "Defence": 65 },
            quests: ["Defender of Varrock", "Dream Mentor", "Hand in the Sand", "King's Ransom", "Legends' Quest", "Mourning's End Part I", "Path of Glouphrie", "Swan Song", "Tears of Guthix", "Wanted!", "The Hunt for Surok"]
        },
        wiki: "While_Guthix_Sleeps"
    },

    // --- Master / Unlocks ---
    {
        id: "desert_treasure_1",
        name: "Desert Treasure I",
        description: "Unlocks Ancient Magicks spellbook (Ice Barrage, Blood Barrage).",
        requirements: {
            levels: { "Magic": 50, "Firemaking": 50, "Thieving": 53, "Slayer": 10 },
            quests: ["The Dig Site", "Temple of Ikov", "The Tourist Trap", "Troll Stronghold", "Priest in Peril", "Waterfall Quest"]
        },
        wiki: "Desert_Treasure_I"
    },
    {
        id: "light_within",
        name: "The Light Within",
        description: "Unlocks Seren Spells and Prayers (Crystallise, Crystal Mask). Excellent for skilling XP.",
        requirements: {
            levels: { "Agility": 80, "Crafting": 80, "Divination": 80, "Herblore": 80, "Prayer": 80, "Slayer": 80, "Woodcutting": 80 },
            quests: ["Plague's End", "Fate of the Gods", "Meeting History", "The World Wakes"]
        },
        wiki: "The_Light_Within"
    },
    {
        id: "lunar_diplomacy",
        name: "Lunar Diplomacy",
        description: "Unlocks the Lunar Spellbook (Skilling spells, Vengeance).",
        requirements: {
            levels: { "Crafting": 61, "Defence": 40, "Firemaking": 49, "Magic": 65, "Mining": 60, "Woodcutting": 55 },
            quests: ["The Fremennik Trials", "Lost City", "Rune Mysteries", "Shilo Village"]
        },
        wiki: "Lunar_Diplomacy"
    },
    {
        id: "dream_mentor",
        name: "Dream Mentor",
        description: "Unlocks full potential of Lunar Spellbook (Humidify, Plank Make).",
        requirements: {
            levels: { "Combat": 85 },
            quests: ["Lunar Diplomacy", "Eadgar's Ruse"]
        },
        wiki: "Dream_Mentor"
    },
    {
        id: "river_of_blood",
        name: "River of Blood",
        description: "Unlocks the Sunspear (T78 Hybrid, augmentable). Best-in-slot for training Invention/Prayer cheaply.",
        requirements: {
            levels: { "Herblore": 80, "Constitution": 80, "Attack": 78, "Ranged": 78, "Magic": 78, "Firemaking": 72, "Fletching": 70, "Mining": 60 },
            quests: ["Lord of Vampyrium"]
        },
        wiki: "River_of_Blood"
    },
    {
        id: "lord_vampyrium",
        name: "Lord of Vampyrium",
        description: "Unlocks Access to Darkmeyer banking and skilling methods.",
        requirements: {
            levels: { "Slayer": 78, "Defence": 79, "Constitution": 78, "Herblore": 78, "Attack": 75, "Ranged": 75, "Magic": 75, "Construction": 79, "Hunter": 76 },
            quests: ["The Branches of Darkmeyer"]
        },
        wiki: "Lord_of_Vampyrium"
    },
    {
        id: "jack_of_spades",
        name: "Jack of Spades",
        description: "Unlocks Menaphos (Mid-level hub). Essential for mid-level Fishing/Woodcutting/Mining/Thieving.",
        requirements: {
            levels: {},
            quests: ["Diamond in the Rough", "Stolen Hearts"]
        },
        wiki: "Jack_of_Spades"
    },
    {
        id: "smoking_kills",
        name: "Smoking Kills",
        description: "Unlocks full Slayer Helmet crafting and full Slayer Points from tasks. Essential for Slayer.",
        requirements: {
            levels: { "Slayer": 35, "Combat": 85 },
            quests: ["Icthlarin's Little Helper", "The Restless Ghost"]
        },
        wiki: "Smoking_Kills"
    },
    {
        id: "fairy_tale_2",
        name: "Fairy Tale II - Cure a Queen",
        description: "Unlocks Fairy Ring transportation network. Essential for clues and travel.",
        requirements: {
            levels: { "Farming": 49, "Herblore": 57, "Thieving": 40 },
            quests: ["Fairy Tale I - Growing Pains"]
        },
        wiki: "Fairy_Tale_II_-_Cure_a_Queen"
    },
    {
        id: "kings_ransom",
        name: "King's Ransom",
        description: "Unlocks the Knight Waves Training Ground for Piety/Rigour/Augury prayers.",
        requirements: {
            levels: { "Magic": 45, "Defence": 65 },
            quests: ["Black Knights' Fortress", "Holy Grail", "Merlin's Crystal", "Murder Mystery", "One Small Favour"]
        },
        wiki: "King%27s_Ransom"
    },
    {
        id: "city_of_senntisten",
        name: "City of Senntisten",
        description: "Unlocks new Ancient spells (Animate Dead, Exsanguinate). Massive tank/dps buff.",
        requirements: {
            levels: { "Slayer": 75, "Archaeology": 74, "Magic": 74 },
            quests: ["Azzanadra's Quest", "Battle of the Monolith"]
        },
        wiki: "City_of_Senntisten"
    },
    {
        id: "sins_of_the_father",
        name: "Sins of the Father",
        description: "Unlocks Anachronia Dinosaur Farm upgrades and lore.",
        requirements: {
            levels: {},
            quests: ["Desperate Measures"]
        },
        wiki: "Sins_of_the_Father"
    },

    // --- Necromancy Series ---
    {
        id: "necromancy_intro",
        name: "Necromancy!",
        description: "Tutorial for Necromancy. Unlocks the City of Um.",
        requirements: { levels: {}, quests: [] },
        wiki: "Necromancy!_(quest)"
    },
    {
        id: "kili_row",
        name: "Kili Row",
        description: "Unlocks Tier 20 Necromancy gear upgrades.",
        requirements: { levels: { "Necromancy": 20 }, quests: ["Necromancy!"] },
        wiki: "Kili_Row"
    },
    {
        id: "rune_mythos",
        name: "Rune Mythos",
        description: "Unlocks Necromancy runecrafting and T40 gear.",
        requirements: { levels: { "Necromancy": 24, "Runecrafting": 25 }, quests: ["Kili Row"] },
        wiki: "Rune_Mythos"
    },
    {
        id: "vessel_harbinger",
        name: "Vessel of the Harbinger",
        description: "Unlocks T60 Necromancy gear.",
        requirements: { levels: { "Necromancy": 50 }, quests: ["Tomes of the Warlock"] },
        wiki: "Vessel_of_the_Harbinger"
    },
    {
        id: "spirit_of_war",
        name: "The Spirit of War",
        description: "Unlocks Boss portals in City of Um and T70 gear.",
        requirements: { levels: { "Necromancy": 60 }, quests: ["Vessel of the Harbinger"] },
        wiki: "The_Spirit_of_War"
    },
    {
        id: "alpha_omega",
        name: "Alpha vs Omega",
        description: "Finale of the First Necromancer arc. Unlocks T90 Power Armour schematics.",
        requirements: { levels: { "Necromancy": 90 }, quests: ["The Spirit of War"] },
        wiki: "Alpha_vs_Omega"
    },

    // --- Fort Forinthry ---
    {
        id: "new_foundations",
        name: "New Foundations",
        description: "Unlocks Fort Forinthry (Workshop, Lodestone, Rested XP).",
        requirements: { levels: { "Construction": 15 }, quests: [] },
        wiki: "New_Foundations"
    },
    {
        id: "murder_border",
        name: "Murder on the Border",
        description: "Unlocks Command Centre (managing your fort).",
        requirements: { levels: { "Construction": 50, "Slayer": 40 }, quests: ["New Foundations"] },
        wiki: "Murder_on_the_Border"
    },
    {
        id: "unwelcome_guests",
        name: "Unwelcome Guests",
        description: "Unlocks Guardhouse tier 1 (Slayer bonuses).",
        requirements: { levels: { "Slayer": 50, "Construction": 50 }, quests: ["Murder on the Border"] },
        wiki: "Unwelcome_Guests"
    },
    {
        id: "dead_and_buried",
        name: "Dead and Buried",
        description: "Unlocks Ranger's Workroom tier 3 (Fletching buffs).",
        requirements: { levels: { "Fletching": 60, "Construction": 60 }, quests: ["Unwelcome Guests"] },
        wiki: "Dead_and_Buried"
    },

    // --- Miscellaneous Useful ---
    {
        id: "throne_miscellania",
        name: "Throne of Miscellania",
        description: "Unlocks Kingdom Management (Passive herbs/logs/coal).",
        requirements: { levels: { "Herblore": 45, "Farming": 45 }, quests: ["The Fremennik Trials", "Heroes' Quest"] },
        wiki: "Throne_of_Miscellania"
    },
    {
        id: "royal_trouble",
        name: "Royal Trouble",
        description: "Boosts Kingdom Management output significantly.",
        requirements: { levels: { "Agility": 40, "Slayer": 40 }, quests: ["Throne of Miscellania"] },
        wiki: "Royal_Trouble"
    },
    {
        id: "family_crest",
        name: "Family Crest",
        description: "Unlocks Gold/Silver smithing gauntlets (Cooking Gauntlets alternative).",
        requirements: { levels: { "Crafting": 40, "Smithing": 40, "Mining": 40, "Magic": 59 }, quests: [] },
        wiki: "Family_Crest"
    },
    {
        id: "mournings_end_2",
        name: "Mourning's End Part II",
        description: "Notorious puzzle quest. Requisite for Plague's End (Prifddinas).",
        requirements: { levels: {}, quests: ["Mourning's End Part I"] },
        wiki: "Mourning%27s_End_Part_II"
    },
    {
        id: "branches_darkmeyer",
        name: "The Branches of Darkmeyer",
        description: "Unlocks Darkmeyer and Blisterwood weapons.",
        requirements: { levels: { "Slayer": 70, "Farming": 70, "Herblore": 70 }, quests: ["Legacy of Seergaze"] },
        wiki: "The_Branches_of_Darkmeyer"
    }
];
