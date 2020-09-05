/**
 * Plugin is the interface for a `Socket` plugin.
 * 
 * @class
 * @interface
 */
export class Plugin {
    /**
     * onclose is called when the WebSocket fires the `onclose` event.
     * 
     * @method
     * @param {object} event The event object.
     */
    onclose = event => null;

    /**
     * onerror is called when the WebSocket fires the `onerror` event.
     * 
     * @method
     * @param {object} event The event object.
     */
    onerror = event => null;

    /**
     * onmessage is called when the WebSocket fires the `onmessage` event.
     * 
     * @method
     * @param {object} event The event object.
     */
    onmessage = event => null;

    /**
     * onopen is called when the WebSocket fires the `onopen` event.
     * 
     * @method
     * @param {object} event The event object.
     */
    onopen = event => null;

    /**
     * onconnect is called when the WebSocket fires the `onconnect` event.
     * 
     * @method
     */
    onconnect = () => null;

    /**
     * ondisconnect is called when the WebSocket fires the `ondisconnect` event.
     * 
     * @method
     */
    ondisconnect = () => null;

    /**
     * ondata is called when the WebSocket fires the `ondata` event.
     * 
     * @method
     * @param {object} data The data object.
     */
    ondata = data => null;

    /**
     * onscheduled is called when the WebSocket has failed and a new connection will soon be attempted.
     * 
     * @method
     * @param {number} timeout The time in milliseconds after which the new attempt will be made.
     */
    onscheduled = timeout => null;

}

export default Plugin;