/* eslint-disable no-underscore-dangle */
import * as pcuiClass from './class'
import { Element } from './element'

interface Args {

}

/**
 * @name TextInput
 * @class
 * @classdesc The TextInput is an input element of type text.
 * @augments Element
 * @mixes IBindable
 * @mixes IFocusable
 * @property {string} placeholder Gets / sets the placeholder label that appears on the right of the input.
 * @property {HTMLElement} input Gets the HTML input element.
 * @property {boolean} renderChanges If true then the TextInput will flash when its text changes.
 * @property {boolean} blurOnEnter=true Gets / sets whether pressing Enter will blur (unfocus) the field. Defaults to true.
 * @property {boolean} blurOnEscape=true Gets / sets whether pressing Escape will blur (unfocus) the field. Defaults to true.
 * @property {boolean} keyChange Gets / sets whether any key up event will cause a change event to be fired.} args
 * @property {Function} onValidate A function that validates the value that is entered into the input
 * and returns true if it is valid or false otherwise.
 * If false then the input will be set in an error state and the value will not propagate to the binding.
 */
export class TextInput extends Element {
  onValidate: null | ((value: string) => boolean) = null

  /**
   * Creates a new TextInput.
   *
   * @param {object} args - Extends the pcui.Element constructor arguments. All settable properties can also be set through the constructor.
   */
  constructor (args: Args = {}) {
    super({
      dom: document.createElement('input'),
      ...args,
    })

    this.dom.classList.add('pcui-text-input')

    this.dom.classList.add('font-mono', 'text-[11px]')

    this.dom.ui = this
    this.dom.tabIndex = 0
    this.dom.autocomplete = 'off'

    this.dom.addEventListener('change', this._onInputChange)
    this.dom.addEventListener('focus', this._onInputFocus)
    this.dom.addEventListener('blur', this._onInputBlur)
    this.dom.addEventListener('keydown', this._onInputKeyDown)
    this.dom.addEventListener('contextmenu', this._onInputCtxMenu, false)

    this._suspendInputChangeEvt = false

    if (args.value !== undefined) {
      this.value = args.value
    }

    this.placeholder = args.placeholder || null
    this.renderChanges = args.renderChanges || false
    this.blurOnEnter = (args.blurOnEnter !== undefined ? args.blurOnEnter : true)
    this.blurOnEscape = (args.blurOnEscape !== undefined ? args.blurOnEscape : true)
    this.keyChange = args.keyChange || false
    this._prevValue = null

    if (args.onValidate !== undefined) {
      this.onValidate = args.onValidate
    }

    this.on('change', () => {
      if (this.renderChanges) {
        this.flash()
      }
    })

    this.on('disable', this._updateInputReadOnly.bind(this))
    this.on('enable', this._updateInputReadOnly.bind(this))
    this.on('readOnly', this._updateInputReadOnly.bind(this))
    this._updateInputReadOnly()
  }

  _onInputChange = (evt) => {
    if (this._suspendInputChangeEvt) {
      return
    }

    if (this.onValidate) {
      const error = !this.onValidate(this.value)
      this.error = error
      if (error) {
        return
      }
    } else {
      this.error = false
    }

    this.emit('change', this.value)

    if (this._binding) {
      this._binding.setValue(this.value)
    }
  }

  _onInputFocus = (evt) => {
    this.dom.classList.add(pcuiClass.FOCUS)
    this.emit('focus', evt)
    this._prevValue = this.value
  }

  _onInputBlur = (evt) => {
    this.dom.classList.remove(pcuiClass.FOCUS)
    this.emit('blur', evt)
  }

  _onInputKeyDown = (evt) => {
    if (evt.keyCode === 13 && this.blurOnEnter) {
      /*
       * Do not fire input change event on blur
       * if keyChange is true (because a change event)
       * will have already been fired before for the current
       * value
       */
      this._suspendInputChangeEvt = this.keyChange
      this.dom.blur()
      this._suspendInputChangeEvt = false
    } else if (evt.keyCode === 27) {
      this._suspendInputChangeEvt = true
      const prev = this.dom.value
      this.dom.value = this._prevValue
      this._suspendInputChangeEvt = false

      // Manually fire change event
      if (this.keyChange && prev !== this._prevValue) {
        this._onInputChange(evt)
      }

      if (this.blurOnEscape) {
        this.dom.blur()
      }
    }

    this.emit('keydown', evt)
  }

  _onInputKeyUp = (evt: KeyboardEvent) => {
    if (evt.keyCode !== 27) {
      this._onInputChange(evt)
    }

    this.emit('keyup', evt)
  }

  _onInputCtxMenu = (evt: Event) => {
    this.dom.select()
  }

  _updateInputReadOnly () {
    const readOnly = !this.enabled || this.readOnly
    if (readOnly) {
      this.dom.setAttribute('readonly', 'readonly')
    } else {
      this.dom.removeAttribute('readonly')
    }
  }

  _updateValue (value: string) {
    this.dom.classList.remove(pcuiClass.MULTIPLE_VALUES)

    if (value && typeof (value) === 'object') {
      if (Array.isArray(value)) {
        let isObject = false
        for (let i = 0; i < value.length; i++) {
          if (value[i] && typeof value[i] === 'object') {
            isObject = true
            break
          }
        }

        value = isObject
          ? '[Not available]'
          : value.map((val) => {
            return val === null ? 'null' : val
          }).join(',')
      } else {
        value = '[Not available]'
      }
    }

    if (value === this.value) {
      return false
    }

    this._suspendInputChangeEvt = true
    this.dom.value = (value === null || value === undefined) ? '' : value
    this._suspendInputChangeEvt = false

    this.emit('change', value)

    return true
  }

  /**
   * @name TextInput#focus
   * @description Focuses the Element.
   * @param {boolean} select - If true then this will also select the text after focusing.
   */
  focus (select: boolean) {
    this.dom.focus()
    if (select) {
      this.dom.select()
    }
  }

  /**
   * @name TextInput#blur
   * @description Blurs (unfocuses) the Element.
   */
  blur () {
    this.dom.blur()
  }

  override destroy () {
    if (this.destroyed) {
      return
    }
    this.dom.removeEventListener('change', this._onInputChange)
    this.dom.removeEventListener('focus', this._onInputFocus)
    this.dom.removeEventListener('blur', this._onInputBlur)
    this.dom.removeEventListener('keydown', this._onInputKeyDown)
    this.dom.removeEventListener('keyup', this._onInputKeyUp)
    this.dom.removeEventListener('contextmenu', this._onInputCtxMenu)
    super.destroy()
    this.dom = null
  }

  set value (value) {
    const changed = this._updateValue(value)

    if (changed) {
      // Reset error
      this.error = false
    }

    if (changed && this._binding) {
      this._binding.setValue(value)
    }
  }

  get value () {
    return this.dom.value
  }

  /* eslint accessor-pairs: 0 */
  set values (values) {
    let different = false
    const value = values[0]
    for (let i = 1; i < values.length; i += 1) {
      if (values[i] !== value) {
        different = true
        break
      }
    }

    if (different) {
      this._updateValue(null)
      this.dom.classList.add(pcuiClass.MULTIPLE_VALUES)
    } else {
      this._updateValue(values[0])
    }
  }

  set placeholder (value) {
    if (value) {
      this.dom.setAttribute('placeholder', value)
    } else {
      this.dom.removeAttribute('placeholder')
    }
  }

  get placeholder () {
    return this.dom.getAttribute('placeholder')
  }

  set keyChange (value) {
    if (this._keyChange === value) {
      return
    }

    this._keyChange = value
    if (value) {
      this.dom.addEventListener('keyup', this._onInputKeyUp)
    } else {
      this.dom.removeEventListener('keyup', this._onInputKeyUp)
    }
  }

  get keyChange () {
    return this._keyChange
  }

  get input () {
    return this.dom
  }
}
