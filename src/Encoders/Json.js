import { NoOpEncoder, Implements } from './common';

/**
 * A JSON Encoder for a Socket.
 * 
 * @class
 * @implements {Encoder}
 */
class JsonEncoder {
    /**
     * Create a new `JsonEncoder` with an optional wrapped `Encoder`.
     * 
     * @param {Encoder} [wrapped=new Encoder()] An optional `Encoder` to wrap around.
     */
    constructor( wrapped ) {
        this.wrapped = Implements( wrapped ) ? wrapped : NoOpEncoder;
    }

    /**
     * Decodes data received from a `Socket`.  
     * 
     * `data` is first passed to any wrapped `Encoder`.  If the resulting value is
     * a string then it will be JSON decoded; otherwise it is returned as-is.
     * 
     * @method
     * @param {string} [data=null] The data to decode.
     * @returns {object|string|null}
     */
    decode = data => {
        if( data ) {
            data = this.wrapped.decode( data );
            if( typeof data === "string" ) {
                data = JSON.parse( data );
            }
            return data;
        }
        return null;
    };

    /**
     * Encodes data to send on a `Socket`.  
     * 
     * If there is no wrapped `Encoder` then the return value is `null` or a JSON-encoded string.
     * Otherwise the return value depends on the wrapped `Encoder`.
     * 
     * @method
     * @param {object|string|null} data The data to encode.
     * @returns {object|string|null}
     */
    encode = data => {
        if( data ) {
            data = JSON.stringify( data );
            return this.wrapped.encode( data );
        }
        return null;
    };
}

export default JsonEncoder;