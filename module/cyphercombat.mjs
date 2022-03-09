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

    game.settings.register('cyphercombat', 'token-image', {
        name: game.i18n.localize("CYPHER-COMBAT.token-img.Name"),
        default: false,
        type: Boolean,
        scope: 'world',
        config: true,
        hint: game.i18n.localize("CYPHER-COMBAT.token-img.Hint"),
        onChange: () => setTimeout(() => {
            location.reload();
         }, 500)
    });

    game.settings.register('cyphercombat', 'combatant-color', {
        name: game.i18n.localize("CYPHER-COMBAT.combatant-color.Name"),
        default: true,
        type: Boolean,
        scope: 'world',
        config: true,
        hint: game.i18n.localize("CYPHER-COMBAT.combatant-color.Hint"),
        onChange: () => setTimeout(() => {
            location.reload();
         }, 500)
    });

});