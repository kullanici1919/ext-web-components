import './CalendarPanelComponent.css';
import './CalendarPanelComponent.html';

export default class CalendarPanelComponent {

  constructor () {
    console.log('in CalendarPanelComponent constructor');
  }

  readyButton1(event) {
    var cmp = event.detail.cmp;
    this.button1Cmp = event.detail.cmp;
  }

  tapButton1(event) {
    this.button1Cmp.setText(new Date())
  }

}
