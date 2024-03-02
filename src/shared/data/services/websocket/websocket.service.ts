import { Observable, Subject, from } from 'rxjs';
import { IApplicationError } from '@interfaces/application/errors';
import { Manager, Socket } from 'socket.io-client';
import { WSConnectError } from '@models/application/errors';
import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private readonly _manager: Manager;

  constructor() {
    this._manager = new Manager(environment.wsRemoteServiceUrl, {
      autoConnect: false
    });
  }

  connect(): Observable<void> {
    return new Observable<void>((subscriber) => {
      this._manager.open((err) => {
        if (err) {
          return subscriber.error();
        }

        subscriber.next();
        subscriber.complete();
      });
    });
  }

  socket(nsp: string): IOSocket {
    return new IOSocket(this._manager.socket(nsp));
  }
}

export class IOSocket {
  private readonly _onConnect: Subject<void>;
  private readonly _onDisconnect: Subject<string>;
  private readonly _onConnectError: Subject<IApplicationError>;

  readonly onConnect$: Observable<void>;
  readonly onDisconnect$: Observable<string>;
  readonly onConnectError$: Observable<IApplicationError>;

  private _id?: string;
  private _connected: boolean;
  private _disconnected: boolean;

  get id(): string | undefined {
    return this._id;
  }

  get connected(): boolean {
    return this._connected;
  }

  get disconnected(): boolean {
    return this._disconnected;
  }

  constructor(private readonly _client: Socket) {
    this._id = this._client.id;
    this._connected = this._client.connected;
    this._disconnected = this._client.disconnected;

    this._onConnect = new Subject();
    this._onDisconnect = new Subject();
    this._onConnectError = new Subject();

    this.onConnect$ = this._onConnect.asObservable();
    this.onDisconnect$ = this._onDisconnect.asObservable();
    this.onConnectError$ = this._onConnectError.asObservable();

    this._bindEventListeners(this._client, {
      connect: this._onSocketConnect.bind(this),
      disconnect: this._onSocketDisconnected.bind(this),
      connect_error: this._onSocketConnectError.bind(this),
    });
  }

  //#region Public API
  /**
   * Manually connects the socket.
   * @returns {IOSocket}
   */
  connect(): this {
    this._client.connect();

    return this;
  }

  /**
   * Manually disconnects the socket. In that case, the socket will not try
   * to reconnect.
   * @returns {IOSocket}
   */
  disconnect(): this {
    this._client.disconnect();

    return this;
  }

  /**
   * emitting and expecting an acknowledgement from the server.
   * @param event
   * @param args
   * @returns
   */
  emitWithAck<T>(event: string, ...args: any[]): Observable<T> {
    return from(this._client.emitWithAck(event, args));
  }

  /**
   * Emits an event to the socket identified by the string name. Any other parameters can
   * be included. All serializable data structures are supported, including `Buffer`.
   * @param event
   * @param args
   * @returns
   */
  emit(event: string, ...args: any[]): true {
    this._client.emit(event, args);

    return true;
  }

  /**
   * Register a new handler for the given event.
   * @param event
   * @returns
   */
  on<T>(event: string): Observable<T> {
    return this._listenOn<T>(event);
  }
  //#endregion

  //#region Private API
  private _listenOn<T>(event: string): Observable<T> {
    const socket = this._client;

    return new Observable((subscriber) => {
      socket.on(event, (message: T) => subscriber.next(message));

      return function unsubscribe() {
        socket.off(event);
      };
    });
  }

  private _bindEventListeners(
    _client: Socket,
    eventListeners: Record<string, (event: any) => void>
  ): Socket {
    for (const [event, listener] of Object.entries(eventListeners)) {
      _client.on(event, listener);
    }

    return _client;
  }
  //#endregion

  //#region Event Listeners
  private _onSocketConnectStatusChanged(isConnected: boolean): void {
    this._connected = isConnected;
    this._disconnected = !isConnected;
  }

  private _onSocketConnect(): void {
    this._onConnect.next();
    this._onSocketConnectStatusChanged(true);
  }

  private _onSocketDisconnected(reason: string): void {
    this._onDisconnect.next(reason);
    this._onSocketConnectStatusChanged(false);
  }

  private _onSocketConnectError(error: Error): void {
    this._onConnectError.next(new WSConnectError(error.message));
    this._onSocketConnectStatusChanged(false);
  }
  //#endregion
}
