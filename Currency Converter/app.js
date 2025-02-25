const BASE_URL = "https://open.er-api.com/v6/latest"; // Correct API endpoint

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency options
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to update exchange rates
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount");
  let amtVal = parseFloat(amount.value);

  if (isNaN(amtVal) || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();

    if (!data.rates) {
      msg.innerText = "Error fetching exchange rates.";
      return;
    }

    const fromRate = data.rates[fromCurr.value];
    const toRate = data.rates[toCurr.value];

    if (!fromRate || !toRate) {
      msg.innerText = "Invalid currency selection.";
      return;
    }

    let rate = toRate / fromRate;
    let finalAmount = (amtVal * rate).toFixed(2);

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Failed to fetch exchange rates. Please try again.";
  }
};

// Function to update currency flag
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Event listener for convert button
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Fetch exchange rate on page load
window.addEventListener("load", updateExchangeRate);
