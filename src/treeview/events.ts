/* eslint-disable no-underscore-dangle */
import { EventHandle } from './event-handle'

type HandleEvent<Type = unknown> = (...args: Type[]) => void

/**
 * Base class for event handling.
 */
export class Events {
  suspendEvents = false
  #additionalEmitters: Events[] = []
  _events: Record<string, HandleEvent<any>[] | undefined> = {}

  /**
   * @param name - Name
   * @param fn - Callback function
   * @returns EventHandle
   */
  on<Type = unknown> (name: string, fn: HandleEvent<Type>): EventHandle {
    const events = this._events[name]
    if (events === undefined) {
      this._events[name] = [fn]
    } else if (events.indexOf(fn) === -1) {
      events.push(fn)
    }
    return new EventHandle(this, name, fn)
  }

  /**
   * @param name - Name
   * @param fn - Callback function
   * @returns EventHandle
   */
  once (name: string, fn: HandleEvent): EventHandle {
    const evt = this.on(name, (...args) => {
      fn.call(this, ...args)
      evt.unbind()
    })
    return evt
  }

  /**
   * @param name - Name
   * @returns Self for chaining.
   */
  emit (name: string, ...args: unknown[]): this {
    if (this.suspendEvents) {
      return this
    }

    let events = this._events[name]
    if (events !== undefined && events.length > 0) {
      events = events.slice(0)

      for (let i = 0; i < events.length; i += 1) {
        if (!events[i]) {
          continue
        }

        events[i].call(this, ...args)
      }
    }

    if (this.#additionalEmitters.length > 0) {
      const emitters = this.#additionalEmitters.slice()

      for (let i = 0, l = emitters.length; i < l; i += 1) {
        emitters[i].emit(name, ...args)
      }
    }

    return this
  }

  /**
   * @param name - Name
   * @param fn - Callback function
   * @returns - This
   */
  unbind (name?: string, fn?: HandleEvent): this {
    if (name === undefined) {
      this._events = { }
    } else {
      const events = this._events[name]
      if (events === undefined) {
        return this
      }

      if (fn === undefined) {
        delete this._events[name]
      } else {
        const i = events.indexOf(fn)
        if (i !== -1) {
          if (events.length === 1) {
            delete this._events[name]
          } else {
            events.splice(i, 1)
          }
        }
      }
    }

    return this
  }

  /**
   * Adds another emitter. Any events fired by this instance
   * will also be fired on the additional emitter.
   *
   * @param emitter - The emitter
   */
  addEmitter (emitter: Events) {
    if (!this.#additionalEmitters.includes(emitter)) {
      this.#additionalEmitters.push(emitter)
    }
  }

  /**
   * Removes emitter.
   *
   * @param emitter - The emitter
   */
  removeEmitter (emitter: Events) {
    const idx = this.#additionalEmitters.indexOf(emitter)
    if (idx !== -1) {
      this.#additionalEmitters.splice(idx, 1)
    }
  }
}
