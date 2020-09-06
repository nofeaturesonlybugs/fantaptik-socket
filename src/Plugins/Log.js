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
     * @param {object} event The event object.
     */
    onclose = event => console.log( "Socket.Log.onclose", event );

    /**
     * onerror is called when the WebSocket fires the `onerror` event.
     * 
     * @method
     * @param {object} event The event object.
     */
    onerror = event => console.log( "Socket.Log.onerror", event );

    /**
     * onmessage is called when the WebSocket fires the `onmessage` event.
     * 
     * @method
     * @param {object} event The event object.
     */
    onmessage = event => console.log( "Socket.Log.onmessage", event );

    /**
     * onopen is called when the WebSocket fires the `onopen` event.
     * 
     * @method
     * @param {object} event The event object.
     */
    onopen = event => console.log( "Socket.Log.onopen", event );

    /**
     * onconnect is called when the WebSocket fires the `onconnect` event.
     * 
     * @method
     */
    onconnect = event => console.log( "Socket.Log.onconnect", event );

    /**
     * ondisconnect is called when the WebSocket fires the `ondisconnect` event.
     * 
     * @method
     */
    ondisconnect = event => console.log( "Socket.Log.ondisconnect", event );

    /**
     * ondata is called when the WebSocket fires the `ondata` event.
     * 
     * @method
     * @param {object} data The data object.
     */
    ondata = data => console.log( "Socket.Log.ondata", data );

    /**
     * onscheduled is called when the WebSocket has failed and a new connection will soon be attempted.
     * 
     * @method
     * @param {number} timeout The time in milliseconds after which the new attempt will be made.
     */
    onscheduled = timeout => console.log("Socket.Log.onscheduled", timeout );
}

export default LogPlugin;