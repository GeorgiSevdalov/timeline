import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Timeline } from 'vis-timeline';
import { DataSet } from 'vis-data';
import { FileInfo } from '../../../interfaces/file-info'
import { forEach } from 'vis-util';
import { CheckEndService } from '../services/check-end.service';

@Component({
  selector: 'app-example-timeline',
  templateUrl: './example-timeline.component.html',
  styleUrls: ['./example-timeline.component.scss']
})
export class ExampleTimelineComponent implements OnInit {

  timeline?: Timeline;
  options?: {};
  data:any;
  groups:any;
  uploadFile:any;
  startCheck:number = 0;
  endCheck:number = 0

  uploadedFiles: any[] = [];
  dataInTimeline:any[] = [];
  rows:any[] = [];
  vidDuration?: number;
  duration: number = 0;


  @ViewChild('timeline', {static: true}) timelineContainer!: ElementRef;

  constructor(
    private checkService: CheckEndService
  ) {
    this.getTimelineData();
    this.getTimelineGroups();
    this.getOptions();
   }

  ngOnInit(): void {
    this.timeline = new Timeline(this.timelineContainer.nativeElement, [],[], this.options);
    this.timeline.setGroups(this.groups);
    this.timeline.setItems(this.data);
    this.timeline.addCustomTime(new Date(1970, 0, 1));
    this.timeline.setCustomTimeTitle("00:00:00,000");

    this.checkService.lastVideoEnd.subscribe((val) => {
      console.log(45545);

      if(val){
        this.startCheck = (val + 0.1);
        this.endCheck = (val + this.duration);
      }
    });

    this.checkService.lastAudioEnd.subscribe((val) => {
      if(val){


        this.startCheck = (val + 0.1);
        this.endCheck = (val + this.duration);
      }
    })

  }

  getTimelineGroups(){
    this.groups = new DataSet([
      {
        id:0,
        content: 'Video'
      },
      {
        id:1,
        content: 'audio'
      }

    ])
  }

  getTimelineData() {

    return this.dataInTimeline;
  }

  getOptions() {

    this.options = {
      orientation: "bottom",
      min: new Date(1970, 0, 1),
      max: new Date(1970, 0, 1, 23, 59, 59, 999),
      showCurrentTime: false,
      multiselect: false,
      multiselectPerGroup: true,
      stack: true,
      zoomMin: 100,
      zoomMax: 21600000,


      editable: {
        add: false,
        updateTime: true,
        updateGroup: true,
      },
      onMove: this.onMove,
      // onMoving: this.onMoving,
      format: {
        minorLabels: {
          millisecond: "SSS [ms]",
          second: "s [s]",
          minute: "HH:mm:ss",
          hour: "HH:mm:ss",
          weekday: "HH:mm:ss",
          day: "HH:mm:ss",
          week: "HH:mm:ss",
          month: "HH:mm:ss",
          year: "HH:mm:ss",
        },
        majorLabels: {
          millisecond: "HH:mm:ss",
          second: "HH:mm:ss",
          minute: "",
          hour: "",
          weekday: "",
          day: "",
          week: "",
          month: "",
          year: "",
        },
      },
    }
  }

  onMove(item:any){
    console.log(item);

  }

  onFileSelected(event: any) {
    window.URL = window.URL || window.webkitURL;
    const file: File = event.target['files'][0];
    this.uploadedFiles.push(file);
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      this.duration = (video.duration) * 1000;
      this.uploadedFiles[this.uploadedFiles.length - 1].duration = this.duration;
      this.vidDuration = this.duration;

      //type check

      let groupeCheck:any;

      if(file.type.split('/')[0] === 'video') {
        groupeCheck = 0;
        if(this.dataInTimeline.length === 0){

          this.checkService.lastVideoEnd.next(this.duration);
          this.endCheck = this.duration;
          this.startCheck = 0;
        };

        if(this.dataInTimeline.length > 0){
          console.log(256);

          if(this.dataInTimeline.find(file => file.group === 0)){
            console.log('next');

            this.checkService.lastVideoEnd.next(Math.max(...this.dataInTimeline.map(o => {
              console.log(255);

              if(o.group === 0)
                return o.end
            })))
          }
        }
      }

      if(file.type.split('/')[0] === 'audio') {
        groupeCheck = 1;

        if(this.dataInTimeline.length === 0){
          this.checkService.lastAudioEnd.next(this.duration);
          this.endCheck = this.duration;
          this.startCheck = 0;
        }
        if(this.dataInTimeline.length > 0){
          if(this.dataInTimeline.find(file => file.group === 1)){
          this.checkService.lastAudioEnd.next(Math.max(...this.dataInTimeline.map(o => {
            if(o.group === 1)
              return o.end
          })))
        }
        }

      }

      const uploadedFileInfo:FileInfo = {
        id:Math.random(),
        group: groupeCheck,
        content: this.uploadedFiles[this.uploadedFiles.length - 1].name,
        type:'',
        duration:(this.uploadedFiles[this.uploadedFiles.length - 1].duration),
        start: (this.startCheck),
        end:(this.endCheck)
      }

      this.dataInTimeline.push(uploadedFileInfo)

      console.log(uploadedFileInfo);

      // console.log(this.dataInTimeline[this.dataInTimeline.length-1].end);

      this.getTimelineData();
      this.timeline?.setItems(this.dataInTimeline);
    }
    video.src = URL.createObjectURL(file);
  }
}

