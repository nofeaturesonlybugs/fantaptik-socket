import { destroy, Events } from '@fantaptik/core';

import { MODULE_NAME } from './consts';

import Encoder from './Encoders';
import Enveloper from './Envelopers';

/**
 * Socket event strings.
 * 
 * @ignore
 */
const EVENT_CONNECT       = 'onconnect';
const EVENT_DATA          = 'ondata';
const EVENT_DISCONNECT    = 'ondisconnect';
const EVENT_SCHEDULED     = 'onscheduled';
const EVENTS_ALL = [ EVENT_CONNECT, EVENT_DATA, EVENT_DISCONNECT, EVENT_SCHEDULED ];

/**
 * `Event` is the event type sent for `Socket` events.
 * 
 * @typedef Socket~Event
 * @type {Object}
 * @property {Socket} socket The `Socket` instance triggering the event.
 * @property {Object} data The decoded data during `ondata` events; `null` for other events.
 * @property {number} scheduled The timeout in milliseconds for an `onscheduled` event; zero for other events.
 */

/**
 * `uriProvider` returns the next websocket URI to attempt; allows client code to rotate
 * through multiple endpoints.  `attemptCount` is reset to zero on an `onopen` WebSocket
 * event; use `attemptCount === 0` to reset to an initial state if necessary.
 * 
 * @callback Socket~uriProvider
 * @param {number} attemptCount The number of connection attempts.
 * @example
 * // Rotating endpoints.
 * const initSocketUris = [ "wss://myhost.com/ws", "wss://mybackuphost.com/ws" ];
 * let socketUris = [ ...initSocketUris ];
 * const socketUriProvider = attemptCount => {
 *     if( attemptCount === 0 ) {
 *         socketUris = [ ...initSocketUris ];
 *     } else {
 *         socketUris = [ uris[ 1 ], uris[ 0 ] ]; 
 *     }
 *     return socketUris[ 0 ];
 * }
 * @returns {string} WebSocket URI endpoint.
 */

 /**
  * `retryProvider` returns the next timeout period in milliseconds to wait before attempting
  * to reconnect on disconnection; return values less than zero are set to zero.
  * `attemptCount` is reset to zero on an `onopen` WebSocket event; use `attemptCount === 0` 
  * to reset to an initial state if necessary.
  * 
  * @callback Socket~retryProvider
  * @param {number} attemptCount The number of connection attempts.
  * @example
  * // A simple backoff algorithm.
  * const initSocketRetryTimeouts = [ 1000, 2500, 5000, 10000 ];
  * let socketRetryTimeouts = [ ...initSocketRetryTimeouts ];
  * const socketRetryProvider = attemptCount => {
  *     if( attemptCount === 0 ) {
  *         socketRetryTimeouts = [ ...initSocketRetryTimeouts ];
  *         return 0;
  *     }
  *     return socketRetryTimeouts.length > 1 ? socketRetryTimeouts.shift() : socketRetryTimeouts[ 0 ];
  * }
  * @returns {number} Timeout in milliseconds.
  */

/**
 * @typedef Socket~Options
 * @see {Socket}
 * @type {object}
 * @property {bool} [buffer=true] When `true` a `Socket` will buffer messages sent when disconnected.
 * @property {bool} [reconnect=true] When `true` a `Socket` will attempt to reconnect on disconnections.
 * @property {string} [messageId="id"] Property name to use as a `message-id` when sending roundtrip messages;
 * i.e. when calling `Socket.promise()`.
 * @property {Socket~retryProvider} [retryProvider= n => 1000] Returns the timeout before attempting to reconnect.
 * @property {Socket~uriProvider} uriProvider Returns the next URI to attempt to connect to.
 * @property {Encoder} [encoder=new JsonEncoder()] A message encoder and decoder.
 * @property {Enveloper} [enveloper= data => data] A message enveloper.
 * @property {Plugin[]} [plugins=[]] An array of plugins.
 * @property {func} [onconnect] Extended event handler for when socket is connected and ready.
 * @property {func} [ondisconnect] Extended event handler for when a socket disconnects.
 * @property {func} [ondata] Extended event handler for data that has been decoded via `encoder` and unpackaged via `enveloper`.
 * @property {func} [onscheduled] Extended event handler for when a connection attempt has been scheduled.
 */
const SocketOptions = {
    buffer : true,
    encoder : new Encoder.Json(),
    enveloper : new Enveloper(),
    messageId : "id",
    plugins : [],
    reconnect : true,
    uriProvider : () => null,
    retryProvider : () => 1000,
};

/**
 * `Socket` simplifies WebSocket and adds extended behavior.  
 * 
 * > *Buffering*  
 * >> Messages sent when disconnected are queued and sent when the socket is opened.  
 * 
 * > *Encoding*  
 * >> Custom encoding/decoding (marshal/unmarshal) can be provided; the default is JSON.
 * 
 * > *Enveloping*  
 * >> Custom wrap/unwrap logic can be provided to package/unpackage objects into/from forms recognized
 * by the endpoint.  
 * 
 * > *Extended Events*  
 * >> The `Socket` class eschews the standard `WebSocket` events in favor of a set of higher level events:
 * >>> **onconnect** - Triggered when the `Socket` has successfully connected to the server.  
 * >>> **ondisconnect** - Triggered when the `Socket` has lost the connection due to either `onerror` or `onclose` and is debounced
 * >>> in the circumstance that both events are trigerred by the underlying `WebSocket` instance.  
 * >>> **ondata** - Triggered when data arrives on the socket; the delivered data will have already been processed by encoder(s) and enveloper(s).  
 * >>> **onscheduled** - Triggered after `ondisconnect` when the socket has the `reconnect` option set to `true`.  
 * 
 * > *Plugins*
 * >> Any number of plugins can be provided when creating a `Socket` instance.  The implemented `Plugin` methods are called as if they were
 * event handlers during the `Socket` instance's lifecycle and activity.  
 * >> Every plugin will have a `Socket` property set to the `Socket` instance.
 * 
 * > *Promises*  
 * >> `Socket.promise( message )` returns a `Promise` that is resolved when a message with the same `message-id` is
 * received.  Use this for `request-reply` use cases.
 * 
 * > *Providers*  
 * >> *retryProvider*  
 * The client application can control the timeout before reconnect attempts to allow for back-off algorithms.
 * 
 * >> *uriProvider*  
 * The client application can change the target URI to attempt failover URIs.
 * 
 * > *Reconnecting*  
 * >> Internal WebSocket instances are created and recreated as necessary for automatic reconnecting.  When using
 * this feature the client application need only create a single instance of `Socket` per endpoint.
 * 
 * # Encoding & Enveloping
 * > *Sending*  
 * >> During a send the data is transformed by:
 * >> ```
 * >> data -> enveloper.wrap( data ) -> [custom-logic] -> encoder.encode( data ) -> socket.send( data )
 * >> ```  
 * >> Where `custom-logic` depends on the original method called.  For example `custom-logic` is where the `promise()` method
 * records the `message-id`.  Therefore the configured `Enveloper` can be the provider of `message-id` values.  
 * 
 * > *Receiving*
 * >> When data is received it is transformed by:
 * >> ```
 * >> data -> encoder.decode( data ) -> [custom-logic] -> enveloper.unwrap( data ) -> ondata( data )
 * >> ```  
 * >> Where `custom-logic` will attempt to correlate the message with internal data such as a `Promise` to resolve.
 * 
 * @class
 * @see {Socket~Event}
 * @see {Socket~Options}
 */
class Socket {
    /**
     * Creates a new `Socket`.
     * 
     * @param {Socket~Options} [options] Overrides the default options.
     */
    constructor( options ) {
        options = options || {};
        this.options = {
            ...SocketOptions,
            ...options,
        };
        this.options.plugins = Array.isArray( this.options.plugins ) ? this.options.plugins : [];

        this.props = {
            // No current connection attempts.
            attemptTimeout : 0,
            attempts : 0,

            // Event registrar
            events : new Events(),
            eventProps : { data : null, socket : this, scheduled : 0, },

            // No current WebSocket instance.
            socket : null,

            // Pending messages awaiting an `onopen`.
            pending : [],

            // Promises awaiting a matching received message in order to resolve.
            promises : {},

            // `true` when `stop()` has been called on the `Socket`.  Calling `connect()` will set `stopped` to `false`.
            stopped : true,
        }

        //
        // Setup our events.
        this.options.plugins.map( plugin => {
            EVENTS_ALL.map( name => typeof plugin[ name ] === "function" ? this.props.events.register( name, e => plugin[ name ]( e ) ) : null );
        } );
        EVENTS_ALL.map( name => typeof this.options[ name ] === "function" ? this.props.events.register( name, e => this.options[ name ]( e ) ) : null );

        // Private scoping some functions.
        this.funcs = {
            /**
             * `onmessage` is called when the Websocket receives data.  The event.data is decoded and unwrapped before sending to 
             * event handlers and Plugins.
             */
            onmessage : event => {
                const { encoder, enveloper, messageId } = this.options;
                const { promises } = this.props;
                let decoded = encoder.decode( event.data );
                let unwrapped = enveloper.unwrap( decoded );
                //
                if( decoded[ messageId ] && promises[ decoded[ messageId ] ] ) {        // Look for `message-id` within promises.
                    let promise = promises[ decoded[ messageId ] ];                     // Remove and resolve the found Promise.
                    delete promises[ decoded[ messageId ] ];
                    promise.resolve( unwrapped );
                } else {
                    this.props.events.trigger( EVENT_DATA, { ...this.props.eventProps, data : unwrapped } );
                }
            },

            /**
             * All outer methods that send data land here for unified Envelope -> custom-logic -> Encode logic.
             * 
             * @param {object} data The data to send.
             * @param {func} custom Custom logic function; any return value is returned to the caller.
             *                      ( wrapped, encoded ) => rv
             * @returns {*} Anything returned by `custom` is returned.
             */
            send : ( data, custom ) => {
                const { pending, socket } = this.props;
                const { buffer, encoder, enveloper } = this.options;
                if( data ) {
                    let wrapped = enveloper.wrap( data );
                    let encoded = encoder.encode( wrapped );
                    let rv = custom ? custom( wrapped, encoded ) : null;
                    if( socket && socket.readyState === WebSocket.OPEN ) {
                        socket.send( encoded );
                    } else if( buffer === true ) {
                        pending.push( encoded );
                    }
                    return rv;
                }
                return null;
            },
        };

        // Give each plugin a handle to the socket.
        // We use setTimeout() to ensure we've left the constructor in case any of
        // the plugins need to call methods on the `Socket` instance.
        setTimeout( () => {
            this.options.plugins.map( plugin => plugin.Socket = this );
        }, 0 );
    }

    /**
     * `destroy` stops the `Socket` and filters to any plugins.  It is an error to use a destroyed `Socket`.
     */
    destroy = () => {
        // Stop ourselves; destroy our event handlers; call destroy on Plugins that implement it; then destroy ourselves.
        this.stop();
        this.props.events.destroy();
        this.options.plugins.map( plugin => typeof plugin.destroy === "function" && plugin.destroy() );
        destroy( this, MODULE_NAME, "Socket" );
    }

    /**
     * `connect` causes the `Socket` to make a connection attempt.  Calls to connect() are debounced in such a way that there is
     * only ever a single instance of `WebSocket` internally.
     */
    connect = () => {
        // schedule will schedule another call to connect if necessary.
        const schedule = () => {
            const { options : { reconnect }, props : { attemptTimeout, stopped, socket } } = this;
            // Can not already have a timeout and can not have a socket; reconnect must be true and stopped can not have been called.
            if( attemptTimeout === 0 && socket === null && reconnect === true && stopped === false ) {
                this.props.attempts += 1;                                                   // Increment our attempt counter.
                let retryTimeout = this.options.retryProvider( this.props.attempts );       // Get the timeout from the provider.
                retryTimeout = typeof retryTimeout === "number" ? retryTimeout : 0;         // retryTimeout must be a number.
                this.props.attemptTimeout = setTimeout( () => {                             // Schedule our reconnect.
                    this.props.attemptTimeout = 0;                                          // Reset attempt timeout to 0.
                    this.connect();
                }, retryTimeout );
                this.props.events.trigger( EVENT_SCHEDULED, { ...this.props.eventProps, scheduled : retryTimeout } );
            }
        };
        // gone is called on `onclose` or `onerror`.
        const gone = () => {
            const { socket } = this.props;
            if( socket ) {
                delete socket.onclose;
                delete socket.onerror;
                delete socket.onopen;
                delete socket.onmessage;
                this.props.socket = null;
                this.props.events.trigger( EVENT_DISCONNECT, { ...this.props.eventProps } );
                schedule();
            }
        };
        //
        // Our regular connect logic.
        let { attemptTimeout, socket } = this.props;
        if( attemptTimeout === 0 && socket === null ) {                     // No scheduled attempt & no socket.
            this.props.stopped = false;                                     // No longer stopped.
            //
            socket = new WebSocket( this.options.uriProvider( this.props.attempts ) );          // Create underlying WebSocket instance.
            this.props.socket = socket;                                     // Remember our socket.
            socket.onmessage = this.funcs.onmessage;                        // Set message handler so nothing is missed.
            //
            socket.onclose = gone;
            socket.onerror = gone;
            socket.onopen = () => {
                this.props.attempts = 0;                                    // Reset our attempt counter.
                this.options.retryProvider( 0 );                            // Reset providers by calling with attempts=0
                this.options.uriProvider( 0 );
                if( this.props.stopped === true ) {                         // stop() was called after connect() but before 
                    this.stop();                                            // the connection was completed.
                } else {
                    this.props.events.trigger( EVENT_CONNECT, { ...this.props.eventProps } );
                    //
                    while( this.props.pending.length > 0 ) {                // Send pending messages if any.
                        socket.send( this.props.pending.shift() );
                    }
                }
            };
        }
    }

    /**
     * `stop` stops the `Socket` connection.
     */
    stop = () => {
        const { attemptTimeout, socket } = this.props;
        this.props.stopped = true;                                  // Purposefully stopped -- this affects our reconnect logic.
        if( socket && socket.readyState === WebSocket.OPEN ) {
            this.props.socket.close();                              // Close the socket.
        } else if( attemptTimeout !== 0 ) {                         // A connect attempt is currently scheduled.
            clearTimeout( attemptTimeout );                         // Cancel the scheduled attempt.
            this.props.attemptTimeout = 0;
        }
    }

    /**
     * `promise` sends the `data` on the `Socket` and returns a `Promise` that will resolve when
     * a corresponding message is received.  Messages are correlated via a `message-id` that
     * is configurable when creating the socket.  
     * 
     * `ondata` is not called when a `Promise` is successfully resolved; instead the message is given directly
     * to the Promise's resolver.  `onmessage` will be called if configured.  
     * 
     * If no `message-id` is found in the enveloped message a `Promise` that will shortly reject is returned.
     * 
     * @param {object} data The data to send on the socket.
     * @returns {Promise} The `Promise` that will later resolve.
     */
    promise = ( data ) => {
        const { promises } = this.props;
        const { messageId } = this.options;
        const custom = ( wrapped ) => {                                         // `wrapped` is the object after enveloping.
            let rv = null;
            if( wrapped[ messageId ] ) {                                        // Must have a `message-id` field for Promise to work.
                rv = new Promise( ( resolve, reject ) => {                      // Create a new promise and remember it internally.
                    promises[ wrapped[ messageId ] ] = { resolve, reject };
                } );
            } else {
                rv = new Promise( ( resolve, reject ) => {                      // No `message-id` field is a Promise that will reject.
                    setTimeout( () => {
                        reject( new Error( "Enveloped message did not have an appropriate `message-id`" ) );
                    }, 200 );
                } );
            }
            return rv;                                                          // This return value is returned to the caller.
        }
        return this.funcs.send( data, custom );
    }

    /**
     * send sends the `data` on the `Socket`.  

     * @param {object} data The data to send on the socket.
     */
    send = data => {
        this.funcs.send( data, null );
    }

    /**
     * `true` when `stop()` has been called on the `Socket`; a call to `connect()` will set `stopped` to `false`.
     * 
     * @type {string}
     */
    get stopped() {
        return this.props.stopped;
    }
}

export default Socket;