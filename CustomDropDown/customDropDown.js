export default class CustomDropDown {
  constructor(selectElement) {
    this.selectElement = selectElement;
    this.options = selectElement.querySelectorAll("option");

    styleSelectElement(this.selectElement);
    styleOptions(this.options);
  }
}

function styleSelectElement(selectElement) {
  selectElement.classList.add("custom-select");
}

function styleOptions(options) {
  [...options].forEach((option) => {
    option.classList.add("custom-option");
    console.log(option);
  });
}
