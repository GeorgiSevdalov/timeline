import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Timeline } from 'vis-timeline';
import { DataSet } from 'vis-data';

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

    console.log(this.timeline);

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
      }
    ])
  }

  getTimelineData() {
    this.data = new DataSet();
    this.data.add ({
      id:1,
      group: 1,
      content: 'item 1',
      start: 0 ,
      end: 30000
    }),
    this.data.add ( {
      id:2,
      group: 0,
      content: 'item 2',
      start: 0,
      end: 30000
    })


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
      // moment: this.changeDate,
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

  changeDate(date:any) {
    // return date.utcOffset('+02:00');
  }
}

// componentDidMount() {
//   const container = document.getElementById("timeline");
//   const options = {
//     orientation: "top",
//     min: new Date(1970, 0, 1),
//     max: new Date(1970, 0, 1, 23, 59, 59, 999),
//     showCurrentTime: false,
//     multiselect: false,
//     multiselectPerGroup: true,
//     stack: true,
//     zoomMin: 100,
//     zoomMax: 21600000,
//     editable: {
//       updateTime: true,
//       updateGroup: true,
//     },
//     onMove: this.onMove,
//     onMoving: this.onMoving,
//     format: {
//       minorLabels: {
//         millisecond: "SSS [ms]",
//         second: "s [s]",
//         minute: "HH:mm:ss",
//         hour: "HH:mm:ss",
//         weekday: "HH:mm:ss",
//         day: "HH:mm:ss",
//         week: "HH:mm:ss",
//         month: "HH:mm:ss",
//         year: "HH:mm:ss",
//       },
//       majorLabels: {
//         millisecond: "HH:mm:ss",
//         second: "HH:mm:ss",
//         minute: "",
//         hour: "",
//         weekday: "",
//         day: "",
//         week: "",
//         month: "",
//         year: "",
//       },
//     },
//   };

//   this.timeline = new Vis(container, [], [], options);
//   this.timeline.addCustomTime(new Date(1970, 0, 1));
//   this.timeline.setCustomTimeTitle("00:00:00,000");
//   this.timeline.on("select", this.onSelect);
//   this.timeline.on("timechange", this.onTimeChange);
//   this.timeline.on("moving", this.onMoving);
//   this.timeline.on("move", this.onMove);
// }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// onMove(item) {
//   item.className = "video";

//   item = this.itemMove(item);

//   if (item !== null) {
//     const itemPath = item.id.split(":");
//     const url = `${server.apiUrl}/project/${this.props.project}/item/move`;
//     const params = {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         track: itemPath[0],
//         trackTarget: item.group,
//         item: Number(itemPath[1]),
//         time: TimelineModel.dateToString(item.start),
//       }),
//     };

//     fetch(url, params)
//       .then((response) => response.json())
//       .then((data) => {
//         if (typeof data.err !== "undefined") {
//           alert(`${data.err}\n\n${data.msg}`);
//         } else {
//           if (itemPath[0] === item.group) {
//             // Same track
//             this.props.loadData();
//           } else {
//             // Moving between tracks
//             const trackType = item.group.includes("audio")
//               ? "audio"
//               : "video";
//             const prevTrack = TimelineModel.findTrack(
//               this.props.items,
//               itemPath[0]
//             );
//             const newTrack = TimelineModel.findTrack(
//               this.props.items,
//               item.group
//             );

//             const addTrack = newTrack.items.length === 0; //
//             const delTrack =
//               TimelineModel.findItem(prevTrack.items, 1) === undefined;

//             if (addTrack && delTrack) this.addTrack(trackType, prevTrack.id);
//             else if (addTrack) this.addTrack(trackType, null);
//             else if (delTrack) this.delTrack(prevTrack.id);
//             else this.props.loadData();
//           }
//         }
//       })
//       .catch((error) => this.props.fetchError(error.message));
//   }
// }
////////////////////////////////////////////////////////////////////////////////////////////
// onMoving(item, callback) {
//   callback(this.itemMove(item));
// }
/////////////////////////////////////////////////////////////////////////////////////////////
// itemMove(item) {
//   if (item.start.getFullYear() < 1970)
//     return null; // Deny move before zero time
//   else {
//     const itemPath = item.id.split(":");

//     if (
//       !(
//         item.group.includes("videotrack") &&
//         itemPath[0].includes("videotrack")
//       )
//     ) {
//       if (
//         !(
//           item.group.includes("audiotrack") &&
//           itemPath[0].includes("audiotrack")
//         )
//       ) {
//         return null;
//       }
//     }

//     item.className = item.className.includes("video") ? "video" : "audio";
//     const itemIndex = itemPath[0] === item.group ? Number(itemPath[1]) : null;
//     const start = TimelineModel.dateToString(item.start);
//     const end = TimelineModel.dateToString(item.end);
//     const track = TimelineModel.findTrack(this.props.items, item.group);
//     const collision = TimelineModel.getItemInRange(
//       track,
//       itemIndex,
//       start,
//       end
//     );
//     if (collision.length === 0) {
//       // Free
//       return item;
//     } else if (collision.length > 1) {
//       // Not enough space
//       return null;
//     } else {
//       // Space maybe available before/after item
//       let itemStart = "";
//       let itemEnd = "";
//       const duration = timeManager.subDuration(end, start);
//       if (
//         timeManager.middleOfDuration(start, end) <
//         timeManager.middleOfDuration(collision[0].start, collision[0].end)
//       ) {
//         // Put before
//         item.className =
//           item.className === "video"
//             ? "video stick-right"
//             : "audio stick-right";
//         itemEnd = collision[0].start;
//         item.end = TimelineModel.dateFromString(itemEnd);

//         itemStart = timeManager.subDuration(collision[0].start, duration);
//         item.start = TimelineModel.dateFromString(itemStart);
//         if (item.start === null) return null; // Not enough space at begining of timeline
//       } else {
//         // Put after
//         item.className =
//           item.className === "video"
//             ? "video stick-left"
//             : "audio stick-left";
//         itemStart = collision[0].end;
//         item.start = TimelineModel.dateFromString(collision[0].end);

//         itemEnd = timeManager.addDuration(collision[0].end, duration);
//         item.end = TimelineModel.dateFromString(itemEnd);
//       }
//       // Check if there is enough space
//       const track = TimelineModel.findTrack(this.props.items, item.group);
//       if (
//         TimelineModel.getItemInRange(track, itemIndex, itemStart, itemEnd)
//           .length === 0
//       ) {
//         return item;
//       }
//       return null;
//     }
//   }
// }
