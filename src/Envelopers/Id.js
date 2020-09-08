import { v4 as uuidv4 } from 'uuid';

import { NoOpEnveloper, Implements } from './common';

/**
 * @typedef IdEnveloper~Options
 * @see {IdEnveloper}
 * @type {object}
 * @property {string} [id="id"] The `message-id` property.
 * @property {string} [data="data"] The `message-data` property.
 * @property {array} [elevate=[]] Array of properties to elevate from `data` into the new object.
 */

/**
 * Default options.
 * 
 * @ignore
 */
const defaultOptions = {
    id : "id",
    data : "data",
    elevate : [],
};

/**
 * IdEnveloper repackages data to include a `message-id` appropriate for `Socket` round-trip messages.
 * 
 * @class
 * @implements {Enveloper}
 */
class IdEnveloper {
    /**
     * Create a new `IdEnveloper` with an optional wrapped `Enveloper`.
     * 
     * @param {IdEnveloper~Options} [options] Overrides the default options.
     * @param {Enveloper} [wrapped=new Enveloper()] An optional `Enveloper` to wrap around.
     */
    constructor( options, wrapped ) {
        this.wrapped = Implements( wrapped ) ? wrapped : NoOpEnveloper;
        this.options = { ...defaultOptions, ...options };
        this.options.elevate = Array.isArray( this.options.elevate ) ? this.options.elevate : []; // TODO Will be silent if not an Array
    }
    /**
     * Unwraps an object into a new object.
     * 
     * @method
     * @param {object} [data=null] The data to unwrap.
     * @returns {object|null}
     */
    unwrap = data => {
        const { wrapped } = this;
        const { data : dataProp, elevate } = this.options;
        const rv = data[ dataProp ] ? data[ dataProp ] : {};
        elevate.map( prop => {
            if( prop !== dataProp && data.hasOwnProperty( prop ) ) {
                rv[ prop ] = data[ prop ];
            }
        } );
        return wrapped.unwrap( rv );
    }

    /**
     * Wraps data into a new object.
     * 
     * @method
     * @param {object} [data=null] The data to wrap.
     * @returns {object|null}
     */
    wrap = data => {
        const { wrapped } = this;
        const { data : dataProp, id : idProp, elevate } = this.options;
        data = wrapped.wrap( data );
        const rv = {
            [dataProp] : data,
            [idProp] : uuidv4(),
        };
        elevate.map( prop => {
            if( prop !== dataProp && data.hasOwnProperty( prop ) ) {
                rv[ prop ] = data[ prop ];
            }
        } );
        return rv;
    }

}

export default IdEnveloper;