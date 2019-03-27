import "./SingleEventComponent.html";

export default class SingleEventComponent {
  constructor() {
    this.count = 0;
  }

  onButtonTap(evt) {
    this.count++;
    const allResultDivs = document.getElementsByName('result-div-single-event');

    for (const resutDiv of allResultDivs) {
      resutDiv.innerHTML = this.count;
    }
  }
}
