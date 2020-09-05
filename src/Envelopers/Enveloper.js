import { Implements } from './common';

import IdEnveloper from './Id';

/**
 * Enveloper wraps and unwraps data for a Socket; envelopers can be chained together.
 *
 * `Enveloper` can be instantiated when an expected `Enveloper` is null.
 * ```js
 * class MyNewEnveloper {
 *     constructor( wrapped ) {
 *         this.wrapped = Enveloper.Implements( wrapped ) ? wrapped : new Enveloper();
 *     }
 * }
 * ```
 * @class
 * @interface
 */
export class Enveloper {
    /**
     * Implements tests if a value implements the Enveloper interface.
     * 
     * @function
     * @name Enveloper.Implements
     * @param {object} test Object to test.
     * @returns {bool} true if `test` implements the interface.
     */
    static Implements = Implements;

    /**
     * Id is a shortcut to the `IdEnveloper` class.
     * 
     * ```js
     * // a and b are both IdEnveloper instances.
     * let a = new IdEnveloper();
     * let b = new Enveloper.Id();
     * ```
     * 
     * @name Enveloper.Id
     */
    static Id = IdEnveloper;

    /**
     * Unwraps an object into a new object.
     * 
     * @method
     * @param {object} [data=null] The data to unwrap.
     * @returns {object|null}
     */
    unwrap = data => data ? data : null;

    /**
     * Wraps data into a new object.
     * 
     * @method
     * @param {object} [data=null] The data to wrap.
     * @returns {object|null}
     */
    wrap = data => data ? data : null;

}

export default Enveloper;