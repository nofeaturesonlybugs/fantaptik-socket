import { Implements } from './common';

import JsonEncoder from './Json';

/**
 * Encoder encodes and decodes data for a Socket; encoders can be chained together.
 *
 * While encoding the final encoder in the chain should return a string to send on the Socket
 * or null to abort the message.  Encoders can return objects to pass to the next encoder.
 *
 * While decoding the final decoder will return a type expected by the application but, in general,
 * will reverse the operations during encoding.  If the final decoder in a chain returns null
 * the socket will not broadcast the message.  
 * 
 * `Encoder` can be instantiated when an expected `Encoder` is null.
 * ```js
 * class MyNewEncoder {
 *     constructor( wrapped ) {
 *         this.wrapped = Encoder.Implements( wrapped ) ? wrapped : new Encoder();
 *     }
 * }
 * ```
 * @class
 * @interface
 */
export class Encoder {
    /**
     * Json is a shortcut to the `JsonEncoder` class.  
     * 
     * ```js
     * // a and b are both JsonEncoder instances.
     * let a = new JsonEncoder();
     * let b = new Encoder.Json();
     * ```
     * 
     * @name Encoder.Json  
     */
    static Json = JsonEncoder;

    /**
     * Implements tests if a value implements the Encoder interface.
     * 
     * @function
     * @name Encoder.Implements
     * @param {object} test Object to test.
     * @returns {bool} true if `test` implements the interface.
     */
    static Implements = Implements;

    /**
     * Decodes data received from a `Socket`.
     * 
     * @method
     * @param {object|string} [data=null] The data to decode.
     * @returns {object|string|null}
     */
    decode = data => data ? data : null;

    /**
     * Encodes data to send on a `Socket`.
     * 
     * @method
     * @param {object|string} [data=null] The data to encode.
     * @returns {object|string|null}
     */
    encode = data => data ? data : null;
}

export default Encoder;