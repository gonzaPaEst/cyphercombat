export function toggleHidden(combatant) {
  combatant.update({ hidden: !combatant.hidden });
};

// Function to toggle defeated status
export async function toggleDefeatedStatus(combatant) {
  const isDefeated = !combatant.isDefeated;
  await combatant.update({ defeated: isDefeated });
  const token = combatant.token;
  if (!token) return;
  // Push the defeated status to the token
  const status = CONFIG.statusEffects.find(e => e.id === CONFIG.Combat.defeatedStatusId);
  if (!status && !token.object) return;
  const effect = token.actor && status ? status : CONFIG.controlIcons.defeated;
  if (token.object) await token.object.toggleEffect(effect, { overlay: true, active: isDefeated });
  else await token.toggleActiveEffect(effect, { overlay: true, active: isDefeated });
};