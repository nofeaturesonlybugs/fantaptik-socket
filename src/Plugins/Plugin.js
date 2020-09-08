/**
 * Plugin is the interface for a `Socket` plugin.  
 * 
 * A `Plugin` does not have to implement the entire interface.  When an interface method is implemented
 * the `Socket` instance will call the `Plugin` method at the appropriate time of its lifecycle and activity.  
 * 
 * Plugins need to support a `Socket` property that will be assigned the instantiated `Socket` they are attached to.  
 * 
 * @class
 * @interface
 */
export class Plugin {
    /**
     * `Socket` is the `Socket` instance attached to the plugin; it is not available in the `Plugin`'s constructor but
     * is available in the other methods.  
     * 
     * @property {Socket}
     * @name Plugin#Socket
     */

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