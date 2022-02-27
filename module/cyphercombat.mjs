import { toggleHidden } from "./helpers/actor-actions.mjs";
import { CypherCombatSidebar } from "./helpers/combat.mjs";
import { registerHelpers } from "./helpers/handlebars.mjs";


Hooks.on('init', () => {

    // Handlerbar Helpers
    registerHelpers.init();

    // New combat tracker
    let combatCypher = new CypherCombatSidebar();
    combatCypher.startup();

    game.socket.on('module.cyphercombat', (data) => {
        if (data.operation === 'toggleHidden') toggleHidden(data.combatant);
    });

});

Hooks.once('ready', async function () {

});
