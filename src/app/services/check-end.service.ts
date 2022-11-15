import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckEndService {

  lastVideoEnd = new BehaviorSubject<number>(0);
  lastAudioEnd = new BehaviorSubject<number>(0);

  constructor() { }
}
