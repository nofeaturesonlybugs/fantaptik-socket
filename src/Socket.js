import { destroy, Events } from '@fantaptik/core';

import { MODULE_NAME } from './consts';

import Encoder from './Encoders';
import Enveloper from './Envelopers';

/**
 * Socket event strings.
 * 
 * @ignore
 */
const EVENT_CLOSE         = 'onclose';
const EVENT_CONNECT       = 'onconnect';
const EVENT_DATA          = 'ondata';
const EVENT_DISCONNECT    = 'ondisconnect';
const EVENT_ERROR         = 'onerror';
const EVENT_MESSAGE       = 'onmessage';
const EVENT_OPEN          = 'onopen';
const EVENT_SCHEDULED     = 'onscheduled';
const EVENTS_ALL = [ EVENT_CLOSE, EVENT_CONNECT, EVENT_DATA, EVENT_DISCONNECT, EVENT_ERROR, EVENT_MESSAGE, EVENT_OPEN, EVENT_SCHEDULED ];

/**
 * `Event` is the event type sent for `Socket` events.  If you need the original event use the `event.originalEvent` property.
 * 
 * @typedef Socket~Event
 * @type {Object}
 * @property {Object} originalEvent The original WebSocket event; `null` for any extended events.
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
 * @property {func} [onclose] Raw event handler for `socket.onclose`
 * @property {func} [onerror] Raw event handler for `socket.onerror`
 * @property {func} [onmessage] Raw event handler for `socket.onmessage`
 * @property {func} [onopen] Raw event handler for `socket.onopen`
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
 * >> The client application can set event handlers for the raw WebSocket events: `onclose`, `onerror`, `onmessage`, and `onopen`.
 * When set these handlers will be called before the `Socket` implements any of its own internal logic to allow the client
 * application a chance to change properties on the `Socket`.  
 * >> However most client applications are only interested in knowing when a socket is usable, when a socket has disconnected, and
 * when data arrives on the socket.  The following events support those notifications: `onconnect`, `ondisconnect`, and `ondata`.  
 * >>> **onconnect** - Fires after `onopen` and can be used to send messages that should not be buffered; also fires after a successful reconnect.  
 * >>> **ondisconnect** - Fires after either `onclose` or `onerorr` and indicates the socket has gone away and may start reconnecting if configured to do so.  
 * >>> **ondata** - Fires after `onmessage` as well as any `Encoder` and `Enveloper` logic.  
 * >>> **onscheduled** - Fires when a connection attempt has been scheduled.  
 * 
 * > *Plugins*
 * >> TODO FILL ME IN  
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
        // console.log("socket()",options);//TODO RM
        this.options = {
            ...SocketOptions,
            ...options,
        };
        this.options.plugins = Array.isArray( this.options.plugins ) ? this.options.plugins : [];

        this.props = {
            // No current connection attempts.
            attempting : false,
            attemptTimeout : 0,
            attempts : 0,

            // Event registrar
            events : new Events(),
            eventProps : { originalEvent : null, socket : this, scheduled : 0, },

            // No current WebSocket instance.
            socket : null,

            // Pending messages awaiting an `onopen`.
            pending : [],

            // Promises awaiting a matching received message in order to resolve.
            promises : {},

            // `true` when `stop()` has been called on the `Socket`.  Calling `connect()` will set `stopped` to `false`.
            stopped : false,
        }

        //
        // Setup our events.
        this.options.plugins.map( plugin => {
            EVENTS_ALL.map( name => typeof plugin[ name ] === "function" ? this.props.events.register( name, e => plugin[ name ]( e ) ) : null );
        } );
        EVENTS_ALL.map( name => typeof this.options[ name ] === "function" ? this.props.events.register( name, e => this.options[ name ]( e ) ) : null );

        /**
         * makeGoneHandler creates onclose & onerror handlers that are mostly identical and can optionally
         * make handlers that start the reconnect cycle.  "Gone" implies the current socket is dead and no
         * longer usable.
         * 
         * @param {string} eventName The event name: onclose, onerror
         * @param {bool} reconnecting True if this is a reconnecting event.
         */
        const makeGoneHandler = ( name, reconnecting ) => {
            const fn = event => {
                this.props.events.trigger( name, event );
                //
                // Our extended "ondisconnect" event that will debounce itself.
                this.funcs.triggerOndisconnect();
                //
                // Remove socket.
                const { socket } = this.props;
                this.props.socket = null;
                delete socket.onclose;
                delete socket.onerror;
                delete socket.onmessage;
                delete socket.onopen;
            };
            if( reconnecting === true ) {
                return event => {
                    fn( event );
                    console.log("Socket." + name + "-reconnecting");//TODO RM
                    this.funcs.scheduleConnect();
                }
            }
            return fn;
        }

        // Private scoping some functions.
        this.funcs = {
            /**
             * scheduleConnect sets a timeout that will attempt to connect.
             */
            scheduleConnect : () => {
                // Can't have a timeout already set and can not be attempting.
                if( this.props.attemptTimeout === 0 && this.props.attempting === false ) {
                    this.props.attempts += 1;
                    const retryTimeout = this.options.retryProvider( this.props.attempts );
                    console.log("Socket.schedule-reconnect",retryTimeout);//TODO RM
                    // Set attempting to true so that calls to connect() do nothing.
                    this.props.attempting = true;
                    // Create and record our timeout.
                    this.props.attemptTimeout = setTimeout( () => {
                        console.log("Socket.attempt-reconnect");//TODO RM
                        // Must set attempting to false so connect() logic will fire.
                        this.props.attempting = false;
                        // Remove timeout handler id.
                        this.props.attemptTimeout = 0;
                        // Now connect!
                        this.connect();
                    }, retryTimeout );
                    this.props.events.trigger( EVENT_SCHEDULED, retryTimeout ); // TODO 
                }
            },

            /**
             * onclose handles the WebSocket onclose event; it is only called on a WebSocket whose onopen()
             * event has also fired.
             */
            onclose : makeGoneHandler( EVENT_CLOSE, false ),

            /**
             * oncloseReconnect is the onclose event that also schedules a reconnect; it is only called on a WebSocket
             * whose onopen() event has also fired.
             */
            oncloseReconnect : makeGoneHandler( EVENT_CLOSE, true ),

            /**
             * onerror handles the WebSocket onerror event; it is only called on a WebSocket whose onopen()
             * event has also fired.
             */
            onerror : makeGoneHandler( EVENT_ERROR ),

            /**
             * triggerOndisconnect triggers our `ondisconnect` extended event.
             */
            triggerOndisconnect : () => {},

            /**
             * ondisconnect is our appropriate `ondisconnect` extended handler.
             */
            ondisconnect : () => {
                this.props.events.trigger( EVENT_DISCONNECT, null );// TODO
                //
                // Now we set triggerOndisconnect to an empty func to debounce if `onerror` and `onclose` quickly fire.
                this.funcs.triggerOndisconnect = () => null;
            },

            /**
             * onerrorReconnect is the onerror event that also schedules a reconnect; it is only called on a WebSocket
             * whose onopen() event has also fired.
             */
            onerrorReconnect : makeGoneHandler( "onerror", true ),

            onmessage : event => {
                this.props.events.trigger( EVENT_MESSAGE, event );
                //
                // Now proceed with our own logic.
                const { encoder, enveloper, messageId } = this.options;
                const { promises } = this.props;
                // console.log("Socket.funcs.onmessage.promises",promises);//TODO RM
                let decoded = encoder.decode( event.data );
                let unwrapped = enveloper.unwrap( decoded );
                //
                if( decoded[ messageId ] && promises[ decoded[ messageId ] ] ) {
                    // console.log("Socket.onmessage.matching-promise",unwrapped);//TODO RM
                    // decoded has the messageId value and we have a matching promise.
                    let promise = promises[ decoded[ messageId ] ];
                    delete promises[ decoded[ messageId ] ];
                    promise.resolve( unwrapped );
                } else {
                    // console.log("Socket.onmessage.no-matching-promise",unwrapped);//TODO RM
                    this.props.events.trigger( EVENT_DATA, unwrapped ); // TODO
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
                    if( socket ) {
                        socket.send( encoded );
                    } else if( buffer === true ) {
                        pending.push( encoded );
                    }
                    return rv;
                }
                return null;
            },
        };

        // Make a connection attempt. // TODO configurable
        // console.log("Socket._attempt().outer");//TODO RM
        // this.connect(); // TODO
        // console.log("Socket._attempt().outer.returned");//TODO RM

        // TODO Implement Socket.options.reconnect
        // TODO Implement Socket.options.immediate ??? i.e. connect on constructor()...

        // Give each plugin a handle to the socket. // TODO Document this behavior.
        // We use setTimeout() to ensure we've left the constructor in case any of
        // the plugins need to call methods on the `Socket` instance.
        setTimeout( () => {
            // console.log("Socket.Socket().set-plugins");//TODO RM
            this.options.plugins.map( plugin => plugin.Socket = this );
        }, 0 );
    }

    /**
     * `destroy` stops the `Socket` and filters to any plugins.  It is an error to use a destroyed `Socket`.
     */
    destroy = () => {
        this.stop();
        this.props.events.destroy();
        this.options.plugins.map( plugin => typeof plugin.destroy === "function" && plugin.destroy() );
        destroy( this, MODULE_NAME, "Socket" );
    }

    /**
     * `connect` causes the `Socket` to make a connection attempt.  If the socket is already connected or already
     * attempting to connect then the call to `connect` does nothing.
     */
    connect = () => {
        // No current socket and also not currently attempting.
        if( this.props.attempting === false && this.props.socket === null ) {
            this.props.attempting = true;
            this.props.stopped = false;
            //console.log("attempt uri",this.options.uriProvider( this.props.attempts ) );//TODO RM
            let socket = new WebSocket( this.options.uriProvider( this.props.attempts ) );
            socket.onmessage = this.funcs.onmessage;
            //
            // By using closures for the remaining events we ensure this.props.socket is
            // set if and only if socket.onopen fires.  Therefore this.funcs.onclose and this.funcs.onerror
            // only ever fire for a socket that made a successful connection.
            const failed = () => {
                //
                // Our attempt has failed.
                this.props.attempting = false;
                //
                // Remove event handlers.
                delete socket.onclose;
                delete socket.onerror;
                delete socket.onmessage;
                delete socket.onopen;
                //
                // Start a reconnect attempt.
                this.funcs.scheduleConnect();
            }
            // N.B:  If the connection fails onerror should be called directly before onclose and both events
            // trigger even though our failed() method removes the handlers.  Poor implementations of WebSocket
            // might behave differently.  Our "scheduleConnect()" function guards against this by remembering
            // the setTimeout ID.
            socket.onclose = event => {
                console.log("socket.attempt.close",event);//TODO
                failed();
            };
            socket.onerror = event => {
                console.log("socket.attempt.error",event);//TODO
                failed();
            };
            socket.onopen = event => {
                // console.log("socket.attempt.open",event,this.props.pending);//TODO
                socket.onclose = this.funcs.oncloseReconnect;
                socket.onerror = this.funcs.onerrorReconnect;
                // On successful open we set triggerOndisconnect to the true ondisconnect handler, which is written
                // such that it will debounce itself.
                this.funcs.triggerOndisconnect = this.funcs.ondisconnect;
                //
                this.props.socket = socket;
                this.props.attempting = false;
                this.props.attempts = 0;
                //
                this.props.events.trigger( EVENT_OPEN, event );
                //
                this.props.events.trigger( EVENT_CONNECT, event );
                //
                // Call providers with attempts=0.
                this.options.retryProvider( 0 );
                this.options.uriProvider( 0 );
                //
                // Send pending messages.
                while( this.props.pending.length > 0 ) {
                    // console.log("Socket.socket.attempt.onopen.send",this.props.pending[0]);//TODO RM
                    socket.send( this.props.pending.shift() );
                }
            };
        }
    }

    /**
     * `stop` stops the `Socket` connection.
     */
    stop = () => {
        if( this.props.socket ) {
            // Set stopped to true before the call to close() to allow plugins and client code to check the property.
            this.props.stopped = true;
            // Set the non-reconnecting handlers.
            this.props.socket.onclose = this.funcs.onclose;
            this.props.socket.onerror = this.funcs.onerror;
            // Close the socket; this will trigger an onclose event.
            this.props.socket.close();
        }
        // TODO What if this.props.attempting === true and this.props.socket === null?
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
        const custom = ( wrapped ) => {
            let rv = null;
            // console.log("Socket.promise.custom",promises,messageId, wrapped,wrapped[ messageId ]);//TODO RM
            if( wrapped[ messageId ] ) {
                rv = new Promise( ( resolve, reject ) => {
                    promises[ wrapped[ messageId ] ] = { resolve, reject };
                } );
            } else {
                rv = new Promise( ( resolve, reject ) => {
                    setTimeout( () => {
                        reject( new Error( "Enveloped message did not have an appropriate `message-id`" ) );
                    }, 200 );
                } );
            }
            // console.log("Socket.promise.custom",promises,this.props.promises);//TODO RM
            return rv;
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