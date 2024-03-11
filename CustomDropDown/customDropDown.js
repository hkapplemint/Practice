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
    return this.options.find(option => option.selected);
  }
}

let debounceTimer;
let searchTerm = "";

function setUpCustomElement(CustomDropDown) {
  CustomDropDown.customElement.classList.add("custom-select-container");
  CustomDropDown.customElement.tabIndex = 0;
  CustomDropDown.labelElement.classList.add("custom-select-value");
  CustomDropDown.labelElement.innerText = CustomDropDown.selectedOption.value;
  CustomDropDown.customElement.append(CustomDropDown.labelElement);

  CustomDropDown.optionsCustomElement.classList.add("custom-select-options");
  CustomDropDown.options.forEach(option => {
    const optionElement = document.createElement("li");
    optionElement.classList.add("custom-select-option");
    optionElement.classList.toggle("selected", option.selected);
    optionElement.innerText = option.text;
    optionElement.dataset.value = option.value;

    optionElement.addEventListener("click", e => {
      CustomDropDown.labelElement.innerText = optionElement.innerText;
      updateOptions(CustomDropDown.customElement, CustomDropDown.options, optionElement.innerText);
    });

    CustomDropDown.optionsCustomElement.append(optionElement);
  });

  CustomDropDown.customElement.append(CustomDropDown.optionsCustomElement);

  CustomDropDown.customElement.addEventListener("click", () => {
    CustomDropDown.optionsCustomElement.classList.toggle("show");
  });
  CustomDropDown.customElement.addEventListener("blur", () => {
    CustomDropDown.optionsCustomElement.classList.remove("show");
  });
  CustomDropDown.customElement.addEventListener("keydown", e => {
    e.preventDefault();

    const selectedOptionIndex = CustomDropDown.options.indexOf(CustomDropDown.selectedOption);
    let selectedElement;
    switch (e.key) {
      case "ArrowUp":
        const prevOption = CustomDropDown.options[selectedOptionIndex - 1];
        if (prevOption) {
          CustomDropDown.labelElement.innerText = prevOption.value;
          updateOptions(CustomDropDown.customElement, CustomDropDown.options, prevOption.value);
          selectedElement = CustomDropDown.customElement.querySelector(
            `[data-value="${prevOption.value}"]`
          );
          selectedElement.scrollIntoView();
        }
        break;
      case "ArrowDown":
        const nextOption = CustomDropDown.options[selectedOptionIndex + 1];
        if (nextOption) {
          CustomDropDown.labelElement.innerText = nextOption.text;
          updateOptions(CustomDropDown.customElement, CustomDropDown.options, nextOption.value);
          selectedElement = CustomDropDown.customElement.querySelector(
            `[data-value="${nextOption.value}"]`
          );
          selectedElement.scrollIntoView();
        }
        break;
      case "Escape":
      case "Enter":
        CustomDropDown.optionsCustomElement.classList.remove("show");
        break;
      default:
        clearTimeout(debounceTimer);
        searchTerm += e.key;
        const selectedOption = CustomDropDown.options.find(option =>
          option.text.toLowerCase().startsWith(searchTerm)
        );
        if (selectedOption) {
          CustomDropDown.labelElement.innerText = selectedOption.text;
          updateOptions(CustomDropDown.customElement, CustomDropDown.options, selectedOption.value);
          selectedElement = CustomDropDown.customElement.querySelector(
            `[data-value="${selectedOption.value}"]`
          );
          selectedElement.scrollIntoView();
        }
        debounceTimer = setTimeout(() => {
          searchTerm = "";
        }, 1000);
        break;
    }
  });
}

function updateOptions(customElement, optionList, newOptionValue) {
  const previouslySelectedOption = optionList.find(option => option.selected);
  const newlySelectedOption = optionList.find(option => option.value === newOptionValue);
  previouslySelectedOption.selected = false;
  newlySelectedOption.selected = true;

  const previouslySelectedOptionElement = customElement.querySelector(".selected");
  const newlySelectedOptionElement = customElement.querySelector(
    `[data-value="${newOptionValue}"]`
  );
  previouslySelectedOptionElement.classList.remove("selected");
  newlySelectedOptionElement.classList.add("selected");
}

function formatOption(options) {
  return [...options].map(option => {
    return {
      text: option.innerText,
      value: option.value,
      selected: option.selected,
      element: option,
    };
  });
}
