import { toggleDefeatedStatus, toggleHidden } from "./actor-actions.mjs";

export class CypherCombatSidebar {
  // This must be called in the `init` hook in order for the other hooks to fire correctly.
  startup() {

    Hooks.on('ready', () => {

      // Stat changes/updates in the combat tracker.
      $('body').on('change', '.combat-input', (event) => {
        event.preventDefault();

        // Get the input and actor element.
        const dataset = event.currentTarget.dataset;
        let $input = $(event.currentTarget);
        let $actorRow = $input.parents('.directory-item.actor-elem');

        // If there isn't an actor element, don't proceed.
        if (!$actorRow.length > 0) {
          return;
        }

        // Retrieve the combatant for this actor, or exit if not valid.
        const combatant = game.combat.data.combatants.find(c => c.data._id == $actorRow.data('combatant-id'));
        if (!combatant) {
          return;
        }

        const actor = combatant.actor;

        // Check for bad numbers, otherwise convert into a Number type.
        let value = $input.val();
        if (dataset.dtype == 'Number') {
          value = Number(value);
          if (Number.isNaN(value)) {
            if ($input[0].id == "might") {
              $input.val(actor.data.data.pools.might.value);
            }
            if ($input[0].id == "speed") {
              $input.val(actor.data.data.pools.speed.value);
            }
            if ($input[0].id == "intellect") {
              $input.val(actor.data.data.pools.intellect.value);
            }
            if ($input[0].id == "health") {
              $input.val(actor.data.data.health.value);
            }
            return false;
          }
        }

        // Prepare update data for the actor.
        let updateData = {};
        // If this started with a "+" or "-", handle it as a relative change.
        let operation = $input.val().match(/^\+|\-/g);
        if (operation) {
          if ($input[0].id == "might") {
            updateData[$input.attr('name')] = Number(actor.data.data.pools.might.value) + value;
          }
          if ($input[0].id == "speed") {
            updateData[$input.attr('name')] = Number(actor.data.data.pools.speed.value) + value;
          }
          if ($input[0].id == "intellect") {
            updateData[$input.attr('name')] = Number(actor.data.data.pools.intellect.value) + value;
          }
          if ($input[0].id == "health") {
            updateData[$input.attr('name')] = Number(actor.data.data.health.value) + value;
          }
          if ($input[0].id == "infrastructure") {
            updateData[$input.attr('name')] = Number(actor.data.data.infrastructure.value) + value;
          }
          if ($input[0].id == "quantity") {
            updateData[$input.attr('name')] = Number(actor.data.data.quantity.value) + value;
          }
        }
        // Otherwise, set it absolutely.
        else {
          updateData[$input.attr('name')] = value;
        }

        // Update stats and invoke toggleTokenSkull
        actor.update(updateData);

        return;
      });

    });

    // Mouse events to highlight and pan to token
    Hooks.on('ready', () => {

      let token;

      // finds token on the canvas
      const findToken = (event) => {
        const combatant = event.currentTarget;
        const c = combatant.dataset.combatantId;
        for (let t of canvas.tokens.placeables) {
          if (t.combatant) {
            if (t.combatant.data._id == c) { token = t };
          }
        }

        return token;
      };

      // highlights token when cursor points combatant in combat-tracker
      $('body').on('mouseenter', '.combatant', (event) => {
        findToken(event);
        if (token.isOwner || game.user.isGM) {
          if (token?.isVisible) {
            if (!token._controlled) token._onHoverIn();
          }
        }
      });

      $('body').on('mouseleave', '.combatant', (event) => {
        findToken(event);
        token._onHoverOut();
      });

      // pans to token when combatant image is clicked in combat-tracker
      $('body').on('click', '.token-image', (event) => {
        findToken(event);
        if (token.isOwner || game.user.isGM) {
          const scale = canvas.scene?._viewPosition.scale;
          canvas.animatePan({ x: token.x, y: token.y, scale: scale, duration: 500 });
          if (token && token.isVisible) {
              canvas.animatePan({ ...token.center, duration: 250 });
          }
        }
      });

      // opens character sheet when combatant image is double-clicked in combat-tracker
      $('body').on('dblclick', '.token-image', (event) => {
        findToken(event);
        if (token.isOwner || game.user.isGM) {
          return token.actor?.sheet.render(true);
        }
      });

      // hightlights combatant on current turn
      $('body').on('click', '.combat-control', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const btn = e.currentTarget;

        const currentTurn = () => {
          setTimeout(() => {
            let currentCombatant = game.combat.current.combatantId
            let trackers = $('.combatant')
            let li = trackers.closest(`[data-combatant-id=${currentCombatant}]`);
            li[0].classList.add('active');
          }, 50);
        };

        if (game.combat.turns.length > 0) {
          switch (btn.dataset.control) {
            case "startCombat":
            case "previousTurn":
            case "nextTurn":
              currentTurn()
              break;
          }
        }
      });

      // controls buttons to toggle visibility, mark damage track, and roll for initiative
      $('body').on('click', '.combatant-control', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const btn = event.currentTarget;
        const li = btn.closest(".combatant");
        const combatant = game.combat.combatants.get(li.dataset.combatantId);

        switch (btn.dataset.control) {
          case "toggleHidden":
            toggleHidden(combatant)
            break;
          case "markImpaired":
            if (combatant.actor.data.data.damage.damageTrack == "Impaired") {
              combatant.actor.update({ "data.damage.damageTrack": 'Hale' })
            } else {
              combatant.actor.update({ "data.damage.damageTrack": 'Impaired' })
            }
            break;
          case "markDebilitated":
            if (combatant.actor.data.data.damage.damageTrack == "Debilitated") {
              combatant.actor.update({ "data.damage.damageTrack": 'Hale' })
            } else {
              combatant.actor.update({ "data.damage.damageTrack": 'Debilitated' })
            }
            break;
          case "markDead":
            toggleDefeatedStatus(combatant);
            break;
          case "rollInitiative":
            return game.combat.rollInitiative([combatant.id]);
        }
      })
    });

    // Re-render combat when actors are modified.
    Hooks.on('updateActor', (actor, data, options, id) => {
      ui.combat.render();
    });

    Hooks.on('updateToken', (scene, token, data, options, id) => {
      if (data) {
        ui.combat.render();
      }
    });

    // When the combat tracker is rendered, we need to completely replace its HTML with a custom version.
    Hooks.on('renderCombatTracker', async (app, html, options) => {
      // Find the combat element, which is where combatants are stored.
      let newHtml = html.find('#combat');
      if (newHtml.length < 1) {
        newHtml = html;
      }

      // If there's as combat, we can proceed.
      if (game.combat) {
        // Retrieve a list of the combatants grouped by actor type.
        let combatants = this.getCombatantsData();

        // Get the custom template.
        let template = 'modules/cyphercombat/templates/combat.hbs';
        let templateData = {
          combatants: combatants
        };

        // Render the template and update the markup with our new version.
        let content = await renderTemplate(template, templateData)
        newHtml.find('#combat-tracker').remove();
        newHtml.find('#combat-round').after(content);
      }
    });
  }

  /*
    Retrieve a list of combatants for the current combat.
   */
  getCombatantsData() {
    // If there isn't a combat, exit and return an empty array.
    if (!game.combat || !game.combat.data) {
      return [];
    }

    let combatants = [];
    // If this is for a combatant that has had its token/actor deleted, remove it from the combat.
    // Else prepare data
    for (let combatant of game.combat.combatants) {
      if (!combatant.actor) {
        game.combat.deleteEmbeddedDocuments('Combatant', [combatant.id]);
      } else {
        // Establish PC's damage track
        let type = combatant.actor.data.type;
        if (type == 'PC') {
          let damageTrack = combatant.actor.data.data.damage.damageTrack;
          combatant.dead = damageTrack == 'Dead';
          combatant.debilitated = damageTrack == 'Debilitated';
          combatant.impaired = damageTrack == 'Impaired';
          combatant.hale = damageTrack == 'Hale';
        }
        // Determine if combatant has rolled for initiative
        combatant.hasRolled = combatant.initiative !== null;

        // Set a property for whether or not this is editable. This controls whether editabel fields like HP will be shown as an input or a div in the combat tracker HTML template.
        combatant.isGM = game.user.isGM;
        combatant.isObserver = (combatant.actor.permission == 2) ? true : false;

        // Determine if combatant is active
        combatant.active = (combatant.data.tokenId == game.combat.combatant.data.tokenId && game.combat.started) ? true : false;

        // Determine if combatant image is token image
        let tokenImg = game.settings.get('cyphercombat', 'token-image');
        combatant.tokenImg = tokenImg === true;

        // Determine if combatants get background colors
        let combatantColor = game.settings.get('cyphercombat', 'combatant-color');
        combatant.combatantColor = combatantColor === true;
      }
      
      // Append actors
      combatants.push(combatant)
    }

    // Sort the combatants by initiative
    combatants.sort((a, b) => {
      const ia = Number.isNumeric(a.initiative) ? a.initiative : -9999;
      const ib = Number.isNumeric(b.initiative) ? b.initiative : -9999;
      const ci = ib - ia;
      if (ci !== 0) return ci;
      return a.id > b.id ? 1 : -1;
    });

    // Return the list of combatants.
    return combatants;
  }
}