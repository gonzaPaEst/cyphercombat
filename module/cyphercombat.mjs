import { CypherCombatSidebar } from "./helpers/combat.mjs";
import { registerHelpers } from "./helpers/handlebars.mjs";


Hooks.once('init', () => {

    // Handlerbar Helpers
    registerHelpers.init();

    // New combat tracker
    let combatCypher = new CypherCombatSidebar();
    combatCypher.startup();

});

Hooks.once('ready', async function () {

});
