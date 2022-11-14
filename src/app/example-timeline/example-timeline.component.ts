import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Timeline } from 'vis-timeline';
import { DataSet } from 'vis-data';
import { FileInfo } from '../../../interfaces/file-info'
import { forEach } from 'vis-util';

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


  uploadedFiles: any[] = [];
  dataInTimeline:any[] = [];
  vidDuration?: number;



  @ViewChild('timeline', {static: true}) timelineContainer!: ElementRef;

  constructor() {
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

  }

  getTimelineGroups(){
    this.groups = new DataSet([
      {
        id:0,
        content: 'Row 1'
      },
      {
        id:1,
        content: 'Row 2'
      },
      {
        id:2,
        content: 'Row 3'
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
        add: true,
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
      const duration = video.duration;
      this.uploadedFiles[this.uploadedFiles.length - 1].duration = duration;
      this.vidDuration = duration;

      // HERE

      //previous file length
      if(this.dataInTimeline.length > 0){
        console.log(this.dataInTimeline[this.dataInTimeline.length-1].end);
      }

      //type check for


      const uploadedFileInfo:FileInfo = {
        id:Math.random(),
        group: this.dataInTimeline.length,
        content: this.uploadedFiles[this.uploadedFiles.length - 1].name,
        type:'',
        duration:(this.uploadedFiles[this.uploadedFiles.length - 1].duration) * 1000,
        start: 0,
        end:(this.uploadedFiles[this.uploadedFiles.length - 1].duration) * 1000
      }

      this.dataInTimeline.push(uploadedFileInfo)

      console.log(uploadedFileInfo);

      console.log(this.dataInTimeline[this.dataInTimeline.length-1].end);

      this.getTimelineData();
      this.timeline?.setItems(this.dataInTimeline);
    }
    video.src = URL.createObjectURL(file);
  }
}

