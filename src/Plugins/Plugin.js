/**
 * Plugin is the interface for a `Socket` plugin.  
 * 
 * A `Plugin` does not have to implement the entire interface.  When an interface method is implemented
 * the `Socket` instance will call the `Plugin` method at the appropriate time of its lifecycle and activity.  
 * 
 * @class
 * @interface
 */
export class Plugin {
    /**
     * onclose is called when the WebSocket fires the `onclose` event.
     * 
     * @method
     * @param {MessageEvent} event The event from the underlying `WebSocket` instance.
     */
    onclose = event => null;

    /**
     * onerror is called when the WebSocket fires the `onerror` event.
     * 
     * @method
     * @param {MessageEvent} event The event from the underlying `WebSocket` instance.
     */
    onerror = event => null;

    /**
     * onmessage is called when the WebSocket fires the `onmessage` event.
     * 
     * @method
     * @param {MessageEvent} event The event from the underlying `WebSocket` instance.
     */
    onmessage = event => null;

    /**
     * onopen is called when the WebSocket fires the `onopen` event.
     * 
     * @method
     * @param {MessageEvent} event The event from the underlying `WebSocket` instance.
     */
    onopen = event => null;

    /**
     * onconnect is called when the WebSocket fires the `onconnect` event.
     * 
     * @method
     * @param {Socket~Event} event The extended event type from this package.
     */
    onconnect = event => null;

    /**
     * ondisconnect is called when the WebSocket fires the `ondisconnect` event.
     * 
     * @method
     * @param {Socket~Event} event The extended event type from this package.
     */
    ondisconnect = event => null;

    /**
     * ondata is called when the WebSocket fires the `ondata` event.
     * 
     * @method
     * @param {Socket~Event} event The extended event type from this package.
     */
    ondata = event => null;

    /**
     * onscheduled is called when the WebSocket has failed and a new connection will soon be attempted.
     * 
     * @method
     * @param {Socket~Event} event The extended event type from this package.
     */
    onscheduled = event => null;

}

export default Plugin;