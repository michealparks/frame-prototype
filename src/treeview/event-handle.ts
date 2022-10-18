/* eslint-disable lines-between-class-members */

import type { Events } from './events'

export class EventHandle {
  owner: Events
  name: string
  fn: () => void

  /**
   * @param owner - Owner
   * @param {string} name - Name
   * @param fn - Callback function
   */
  constructor (owner: Events, name: string, fn: () => void) {
    this.owner = owner
    this.name = name
    this.fn = fn
  }

  /**
   */
  unbind () {
    if (!this.owner) {
      return
    }

    this.owner.unbind(this.name, this.fn)

    this.owner = null
    this.name = null
    this.fn = null
  }

  /**
   */
  call (...args: unknown[]) {
    if (!this.fn) {
      return
    }

    this.fn.call(this.owner, ...args)
  }

  /**
   * @param {string} name - Name
   * @param {HandleEvent} fn - Callback function
   * @returns {EventHandle} - EventHandle
   */
  on (name, fn) {
    return this.owner.on(name, fn)
  }
}
