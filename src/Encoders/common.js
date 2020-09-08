/**
 * NoOpEncoder is an encoder that simply returns whatever is given to it.
 * 
 * @ignore
 */
export const NoOpEncoder = {
    decode : data => data,
    encode : data => data,
}

/**
 * Implements tests if a value implements the Encoder interface.
 * 
 * @ignore
 * @param {object} test Object to test.
 * @returns {bool} true if `test` implements the interface.
 */
export const Implements = ( test ) => {
    return test !== null && test !== undefined
        && test.decode && typeof test.decode === "function"
        && test.encode && typeof test.encode === "function";
};