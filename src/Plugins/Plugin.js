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