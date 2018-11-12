import { Component, OnInit } from '@angular/core';
import {AppState} from '../../app.service'
import {SocketService} from '../../services/socket.service'
import {Router} from '@angular/router';

@Component({
  selector: 'direction',
  templateUrl: './direction.component.html',
  styleUrls: ['./direction.component.css']
})
export class DirectionComponent implements OnInit {

  menuName = "Выбор направления";
  directions;
  channels;
  state;
  socket;
  curCh;

  constructor(
    private appState: AppState,
    private router: Router,
    private socketService: SocketService
  ) { }

  subscription;

  ngOnInit() {
    this.state = this.appState.state;
    this.socket = this.socketService.socket;
    this.directions = this.state.directions;
    this.channels = this.state.channels;
    this.curCh = 0;

    this.appState.set('footerButtons', {
      left: {
        text: 'Выбрать',
        route: '/direction'
      },
      right: {
        text: 'Назад',
        route: '../'
      }
    });

    this.subscription = this.appState.state.button.subscribe(data => {
      switch (data) {
        case 11: // choose

          break;
        case 13: // back
          this.router.navigate([this.appState.state['footerButtons'].right.route]);
          break;
        case 12: // up
          break;
        case 15: // down
          break;
      }
    });
  }

  getChName(id) {
    const idx = this.channels.findIndex(x => x.id == id);
    return this.channels[idx].name;
  }

  changeCurMode(dir) {
    this.appState.storage.set('curMode', dir);
    this.router.navigate(["/"]);
    const index = this.state.channels.findIndex(x => x.id === dir.channelId);
    this.socket.emit('setChannel', this.state.channels[index]);
  }
}
