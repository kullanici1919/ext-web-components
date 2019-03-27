import './SelectFieldComponent.css';
import './SelectFieldComponent.html';
Ext.require('Ext.Toast');

export default class SelectFieldComponent {

  constructor () {
    console.log('in SelectFieldComponent constructor');
  }

  onchangeselectfield(event) {
    return Ext.toast(`You selected the item with value ${event.detail.newValue}`);
  }

}
