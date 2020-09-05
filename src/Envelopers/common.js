/**
 * NoOpEnveloper is an enveloper that simply returns whatever is given to it.
 * 
 * @ignore
 */
export const NoOpEnveloper = {
    wrap : data => data,
    unwrap : data => data,
}

/**
 * Implements tests if a value implements the Enveloper interface.
 * 
 * @ignore
 * @param {object} test Object to test.
 * @returns {bool} true if `test` implements the interface.
 */
export const Implements = ( test ) => {
    return test !== null && test !== undefined
        && test.wrap && typeof test.wrap === "function"
        && test.unwrap && typeof test.unwrap === "function";
};