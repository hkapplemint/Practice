export default class CustomDropDown {
  constructor(selectElement) {
    this.selectElement = selectElement;
    this.options = formatOption(selectElement.querySelectorAll("option"));
    this.customElement = document.createElement("div");
    this.labelElement = document.createElement("span");
    this.optionsCustomElement = document.createElement("ul");

    setUpCustomElement(this);
    selectElement.style.display = "none";
    selectElement.after(this.customElement);
  }

  get selectedOption() {
    return this.options.find((option) => option.selected);
  }
}

function setUpCustomElement(CustomDropDown) {
  CustomDropDown.customElement.classList.add("custom-select-container");
  CustomDropDown.customElement.tabIndex = 0;
  CustomDropDown.labelElement.classList.add("custom-select-value");
  CustomDropDown.labelElement.innerText = CustomDropDown.selectedOption.value;
  CustomDropDown.customElement.append(CustomDropDown.labelElement);

  CustomDropDown.optionsCustomElement.classList.add("custom-select-options");
  CustomDropDown.options.forEach((option) => {
    const optionElement = document.createElement("li");
    optionElement.classList.add("custom-select-option");
    optionElement.classList.toggle("selected", option.selected);
    optionElement.innerText = option.text;
    optionElement.dataset.value = option.value;

    optionElement.addEventListener("click", (e) => {
      CustomDropDown.labelElement.innerText = optionElement.innerText;
      updateOptions(CustomDropDown.options, optionElement.innerText);
    });

    CustomDropDown.optionsCustomElement.append(optionElement);
  });

  CustomDropDown.customElement.append(CustomDropDown.optionsCustomElement);

  CustomDropDown.customElement.addEventListener("click", () => {
    CustomDropDown.optionsCustomElement.classList.toggle("show");
  });
  CustomDropDown.customElement.addEventListener("keydown", (e) => {
    e.preventDefault();

    const selectedOptionIndex = CustomDropDown.options.indexOf(
      CustomDropDown.selectedOption
    );
    let selectedElement;
    switch (e.key) {
      case "ArrowUp":
        if (CustomDropDown.options[selectedOptionIndex - 1]) {
          CustomDropDown.labelElement.innerText =
            CustomDropDown.options[selectedOptionIndex - 1].value;
          updateOptions(
            CustomDropDown.options,
            CustomDropDown.labelElement.innerText
          );
          selectedElement = document.querySelector(
            `[data-value="${CustomDropDown.labelElement.innerText}"]`
          );
          selectedElement.scrollIntoView();
        }
        break;
      case "ArrowDown":
        if (CustomDropDown.options[selectedOptionIndex + 1]) {
          CustomDropDown.labelElement.innerText =
            CustomDropDown.options[selectedOptionIndex + 1].value;
          updateOptions(
            CustomDropDown.options,
            CustomDropDown.labelElement.innerText
          );
          selectedElement = document.querySelector(
            `[data-value="${CustomDropDown.labelElement.innerText}"]`
          );
          selectedElement.scrollIntoView();
        }
        break;
    }
  });
}

function updateOptions(optionList, newOptionText) {
  const previouslySelectedOption = optionList.find((option) => option.selected);
  const newlySelectedOption = optionList.find(
    (option) => option.text === newOptionText
  );
  previouslySelectedOption.selected = false;
  newlySelectedOption.selected = true;

  const previouslySelectedOptionElement = document.querySelector(".selected");
  const newlySelectedOptionElement = document.querySelector(
    `[data-value="${newOptionText}"]`
  );
  previouslySelectedOptionElement.classList.remove("selected");
  newlySelectedOptionElement.classList.add("selected");
}

function formatOption(options) {
  return [...options].map((option) => {
    return {
      text: option.innerText,
      value: option.value,
      selected: option.selected,
      element: option,
    };
  });
}
