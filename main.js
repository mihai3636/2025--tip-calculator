const tipValueEl = document.getElementById("tipValue").querySelector("span");
const totalValueEl = document
  .getElementById("totalValue")
  .querySelector("span");

const inputCustomEl = document.getElementById("inputCustom");
const inputBillEl = document.getElementById("inputBill");
const inputPeopleEl = document.getElementById("inputPeople");
const btnResetEl = document.getElementById("btnReset");

const tipRadiosEls = document.querySelectorAll('input[type="radio"]');

let selectedTip = 5;
let customTipChecked = false;

let inputBillValue = 0;
let inputPeopleValue = 1;

let tipPerPerson = 4.27;
let totalPerPerson = 32.79;

const DEFAULT_RADIO_TIP = selectedTip.toString();

initListeners();
updateUi();

function onRadioClick() {
  computeResults();
}

function initListeners() {
  tipRadiosEls.forEach((radio) => {
    radio.addEventListener("click", onRadioClick);
  });

  inputCustomEl.addEventListener("click", () => {
    document.querySelector('input[value="custom"]').checked = true;
    selectedTip = "custom";
  });

  inputBillEl.addEventListener("input", (e) => {
    inputBillEl.value = filterTextToOnePointDecimal(inputBillEl.value);

    computeResults();
  });

  inputPeopleEl.addEventListener("input", (e) => {
    inputPeopleEl.value = filterTextToInteger(inputPeopleEl.value);

    computeResults();
  });

  inputCustomEl.addEventListener("input", (e) => {
    inputCustomEl.value = filterTextToInteger(inputCustomEl.value);

    computeResults();
  });

  btnResetEl.addEventListener("click", (e) => {
    tipPerPerson = 0;
    totalPerPerson = 0;

    selectedTip = 5;
    customTipChecked = false;

    inputBillValue = 0;
    inputPeopleValue = 1;

    updateUi();
    hideError();
  });
}

function filterTextToOnePointDecimal(value) {
  value = value.replace(/[^\d.]/g, "");

  if (value.startsWith(".")) {
    value = "0" + value;
  }

  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("");
  }

  if (value.startsWith("00")) {
    value = value.substring(1);
  }

  if (
    value.startsWith("0") &&
    value.length > 1 &&
    ![".", ","].includes(value[1])
  ) {
    value = value.substring(1);
  }

  return value;
}

function filterTextToInteger(value) {
  value = value.replace(/[^\d]/g, "");

  if (value.startsWith("0") && value.length > 1) {
    value = value.substring(1);
  }

  return value;
}

function updateUi() {
  tipValueEl.textContent = tipPerPerson.toFixed(2);
  totalValueEl.textContent = totalPerPerson.toFixed(2);

  updateBillUi();
  updatePeopleUi();
  updateSelectedTipUi();
}

function updateBillUi() {
  let uiValue = "";
  if (inputBillValue !== 0) {
    uiValue = inputBillValue.toString();
  }

  inputBillEl.value = uiValue;
}

function updatePeopleUi() {
  let uiValue = "";
  if (inputPeopleValue !== 0) {
    uiValue = inputPeopleValue.toString();
  }

  inputPeopleEl.value = uiValue;
}

function updateCustomTipUi() {
  if (!customTipChecked) {
    inputCustomEl.value = "";
    return;
  }
  let uiValue = selectedTip.toString();

  inputCustomEl.value = uiValue;
}

function updateSelectedTipUi() {
  let radioEl;
  radioEl = Array.from(tipRadiosEls).find(
    (radio) => radio.value === selectedTip.toString()
  );

  if (customTipChecked) {
    radioEl = Array.from(tipRadiosEls).find(
      (radio) => radio.value === "custom"
    );
  }

  radioEl.checked = true;
  updateCustomTipUi();
}

function getSelectedTipValue() {
  let radioEl = Array.from(tipRadiosEls).find((radio) => {
    return radio.checked === true;
  });

  if (radioEl.value === "custom") {
    selectedTip = Number(inputCustomEl.value);
    customTipChecked = true;
    return;
  }

  selectedTip = Number(radioEl.value);
  customTipChecked = false;
}

function getBillValue() {
  inputBillValue = Number(inputBillEl.value);
}

function getPeopleValue() {
  inputPeopleValue = Number(inputPeopleEl.value);
}

function computeResults() {
  getBillValue();
  getPeopleValue();
  getSelectedTipValue();

  if (!isValid()) {
    return;
  }

  let tip = (selectedTip / 100) * inputBillValue;
  tipPerPerson = tip / inputPeopleValue;

  totalPerPerson = inputBillValue / inputPeopleValue + tipPerPerson;

  updateUi();
}

function isValid() {
  if (inputPeopleValue > 0) {
    hideError();
    return true;
  }

  showError();
  return false;
}

function showError() {
  document.getElementById("peopleFieldset").classList.add("invalid");
}

function hideError() {
  document.getElementById("peopleFieldset").classList.remove("invalid");
}
