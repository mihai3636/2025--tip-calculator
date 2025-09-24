console.log("Hello world!");

const customInputEl = document.getElementById("inputCustomTip");

customInputEl.addEventListener("click", () => {
  document.querySelector('input[value="custom"]').checked = true;
});
