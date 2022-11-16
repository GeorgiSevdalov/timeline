import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Timeline } from 'vis-timeline';
import { DataSet } from 'vis-data';
import { FileInfo } from '../../../interfaces/file-info'
import { CheckEndService } from '../services/check-end.service';
import { DateTime } from 'luxon';
import * as moment from 'moment';

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
  duration: number = 0;
  

  dataInTimeline:any[] = []; // = [...audioFiles, ...videoFiles]
  audioFiles:any[] = [];
  videoFiles:any[] = [];




  @ViewChild('timeline', {static: true}) timelineContainer!: ElementRef;

  constructor(
    private checkService: CheckEndService
  ) { }

  ngOnInit(): void {
    this.getTimelineData();
    this.getTimelineGroups();
    
    this.options = {
      orientation: "top",
      min: DateTime.utc(1970, 1, 1).toISO(),
      max: DateTime.utc(1970, 1, 1,23, 59, 59, 999).toISO(),
      showCurrentTime: false,
      multiselect: false,
      multiselectPerGroup: true,
      stack: false,
      zoomMin: 100,
      zoomMax: 21600000,
      editable: {
        updateTime: true,
        updateGroup: true,
      },
      moment: () => {
        return moment(DateTime.utc())
      }
     ,
      onMove: this.onMove,
      // onMoving: this.onMoving,
      format: {
        minorLabels: {
					millisecond:'SSS [ms]',
					second:     's [s]',
					minute:     'HH:mm:ss',
					hour:       'HH:mm:ss',
					weekday:    'HH:mm:ss',
					day:        'HH:mm:ss',
					week:       'HH:mm:ss',
					month:      'HH:mm:ss',
					year:       'HH:mm:ss'
				},
				majorLabels: {
					millisecond:'HH:mm:ss',
					second:     'HH:mm:ss',
					minute:     '',
					hour:       '',
					weekday:    '',
					day:        '',
					week:       '',
					month:      '',
					year:       ''
				}
      }
    };
    this.timeline = new Timeline(this.timelineContainer.nativeElement, [],[], this.options);
    this.timeline.addCustomTime(DateTime.utc(1970, 1, 1).toISO());
    this.timeline.setCustomTimeTitle("00:00:00,000");
    this.timeline.setGroups(this.groups);
    this.timeline.setItems(this.data);
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

    // return this.groups;
  }

  getTimelineData() {

    return this.dataInTimeline;
  }



  onMove(item:any){
    console.log(item);
  }

  onFileSelected(event: any) {

    const file: File = event.target['files'][0];
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);

      //set duration

      this.duration = (video.duration) * 1000;

      //type check

      let groupeCheck:any;

      if(file.type.split('/')[0] === 'video') {
        groupeCheck = 0;

        if(this.videoFiles.length === 0) {
          this.startCheck = 0;
          this.endCheck = this.duration
        }

        if(this.videoFiles.length > 0) {
          this.startCheck = Math.max(...this.videoFiles.map(o =>{
            return o.end}));
            this.endCheck = this.startCheck + this.duration;
        }
      }

      if(file.type.split('/')[0] === 'audio') {
        groupeCheck = 1;

        if(this.audioFiles.length === 0) {
          this.startCheck = 0;
          this.endCheck = this.duration
        }

        if(this.audioFiles.length > 0) {
          this.startCheck = Math.max(...this.audioFiles.map(o =>{
            return o.end}));
            this.endCheck = this.startCheck + this.duration;
        }
      }

      const uploadedFileInfo:FileInfo = {
        id:Math.random(),
        group: groupeCheck,
        content: file.name,
        type:'',
        duration:this.duration,
        start: (this.startCheck),
        end:(this.endCheck)
      }

      if(uploadedFileInfo.group === 0) {
        this.videoFiles.push(uploadedFileInfo);
      }

      if(uploadedFileInfo.group === 1) {
        this.audioFiles.push(uploadedFileInfo);
      }

      this.dataInTimeline = [...this.videoFiles, ...this.audioFiles]

      this.getTimelineData();
      this.timeline?.setItems(this.dataInTimeline);
    }
    video.src = URL.createObjectURL(file);
  }
}