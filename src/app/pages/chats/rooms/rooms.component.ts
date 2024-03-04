import { Component, OnDestroy, OnInit } from '@angular/core';
import { IOSocket, WebsocketService } from '@services/websocket';
import { observableRegistrarFactory } from '@helpers/rxjs';
import { IApplicationError } from '@interfaces/application/errors';
import { ServerEvent } from '@constants/enums';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-rooms',
  standalone: true,
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss',
  imports: [],
})
export class RoomsComponent implements OnInit, OnDestroy {
  private readonly _ngDestroy: Subject<void>;
  private readonly _ws: IOSocket;

  constructor(private readonly _wsService: WebsocketService) {
    this._ws = this._wsService.socket('/rooms');
    this._ngDestroy = new Subject();
  }

  ngOnInit(): void {
    this._initData();
    this._ws.connect();
  }

  ngOnDestroy(): void {
    this._ws.disconnect();
    this._ngDestroy.next();
  }

  private _initData(): void {
    const register = observableRegistrarFactory.call(this, this._ngDestroy);

    register(this._ws.onConnect$, this._onSocketConnected);
    register(this._ws.onConnectError$, this._onSocketConnectError);
    register(this._ws.on(ServerEvent.ROOM_LIST_SENT), this._onRoomListReceived);
  }

  private _onSocketConnected(): void {
    console.log('connected to rooms');
  }

  private _onSocketConnectError(error: IApplicationError): void {
    console.log(error.code);
  }

  private _onRoomListReceived(data: any) {
    console.log(data)
  }
}
