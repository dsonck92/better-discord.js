'use strict';

const CachedManager = require('./CachedManager');
const { Presence } = require('../structures/Presence');

/**
 * Manages API methods for Presences and holds their cache.
 * @extends {CachedManager}
 */
class PresenceManager extends CachedManager {
  constructor(client, iterable) {
    super(client, Presence, iterable);
  }

  /**
   * The cache of Presences
   * @type {Collection<Snowflake, Presence>}
   * @name PresenceManager#cache
   */

  _add(data, guild, cache) {
    if (typeof guild === 'boolean') {
      cache = guild;
      guild = undefined;
    }
    const existing = this.cache.get(data.user.id);
    const ret = existing ? existing.patch(data) : super._add(data, cache, { id: data.user.id });
    if (guild) guild.presences.cache.set(data.user.id, ret);
    return ret;
  }

  /**
   * Data that can be resolved to a Presence object. This can be:
   * * A Presence
   * * A UserResolvable
   * * A Snowflake
   * @typedef {Presence|UserResolvable|Snowflake} PresenceResolvable
   */

  /**
   * Resolves a {@link PresenceResolvable} to a {@link Presence} object.
   * @param {PresenceResolvable} presence The presence resolvable to resolve
   * @returns {?Presence}
   */
  resolve(presence) {
    const presenceResolvable = super.resolve(presence);
    if (presenceResolvable) return presenceResolvable;
    const UserResolvable = this.client.users.resolveId(presence);
    return super.resolve(UserResolvable);
  }

  /**
   * Resolves a {@link PresenceResolvable} to a {@link Presence} id.
   * @param {PresenceResolvable} presence The presence resolvable to resolve
   * @returns {?Snowflake}
   */
  resolveId(presence) {
    const presenceResolvable = super.resolveId(presence);
    if (presenceResolvable) return presenceResolvable;
    const userResolvable = this.client.users.resolveId(presence);
    return this.cache.has(userResolvable) ? userResolvable : null;
  }
}

module.exports = PresenceManager;
