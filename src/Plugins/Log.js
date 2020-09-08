import Plugin from './Plugin';

/**
 * LogPlugin performs console.log() calls for a `Socket`.
 * 
 * @class
 * @implements {Plugin}
 */
class LogPlugin extends Plugin {
    /**
     * Creates a new `LogPlugin`.
     */
    constructor() {
        super();
    }

    /**
     * onclose is called when the WebSocket fires the `onclose` event.
     * 
     * @method
     * @param {MessageEvent} event The event from the underlying `WebSocket` instance.
     */
    onclose = event => console.log( "Socket.Log.onclose", event );

    /**
     * onerror is called when the WebSocket fires the `onerror` event.
     * 
     * @method
     * @param {MessageEvent} event The event from the underlying `WebSocket` instance.
     */
    onerror = event => console.log( "Socket.Log.onerror", event );

    /**
     * onmessage is called when the WebSocket fires the `onmessage` event.
     * 
     * @method
     * @param {MessageEvent} event The event from the underlying `WebSocket` instance.
     */
    onmessage = event => console.log( "Socket.Log.onmessage", event );

    /**
     * onopen is called when the WebSocket fires the `onopen` event.
     * 
     * @method
     * @param {MessageEvent} event The event from the underlying `WebSocket` instance.
     */
    onopen = event => console.log( "Socket.Log.onopen", event );

    /**
     * onconnect is called when the WebSocket fires the `onconnect` event.
     * 
     * @method
     * @param {Socket~Event} event The extended event type from this package.
     */
    onconnect = event => console.log( "Socket.Log.onconnect", event );

    /**
     * ondisconnect is called when the WebSocket fires the `ondisconnect` event.
     * 
     * @method
     * @param {Socket~Event} event The extended event type from this package.
     */
    ondisconnect = event => console.log( "Socket.Log.ondisconnect", event );

    /**
     * ondata is called when the WebSocket fires the `ondata` event.
     * 
     * @method
     * @param {Socket~Event} event The extended event type from this package.
     */
    ondata = data => console.log( "Socket.Log.ondata", event );

    /**
     * onscheduled is called when the WebSocket has failed and a new connection will soon be attempted.
     * 
     * @method
     * @param {Socket~Event} event The extended event type from this package.
     */
    onscheduled = timeout => console.log("Socket.Log.onscheduled", event );
}

export default LogPlugin;