let selectedShape = "rectangle";
let uploadedImage = "";

const elements = {
  textInput: document.getElementById("textInput"),
  photoInput: document.getElementById("photoInput"),
  clearPhotoButton: document.getElementById("clearPhotoButton"),
  printWidth: document.getElementById("printWidth"),
  printHeight: document.getElementById("printHeight"),
  sheetWidth: document.getElementById("sheetWidth"),
  sheetHeight: document.getElementById("sheetHeight"),
  horizontalGap: document.getElementById("horizontalGap"),
  verticalGap: document.getElementById("verticalGap"),
  mirrorCheckbox: document.getElementById("mirrorCheckbox"),
  printButton: document.getElementById("printButton"),
  printSheet: document.getElementById("printSheet"),
  printCount: document.getElementById("printCount")
};

function getNumber(element, fallback = 0) {
  const value = Number(element.value);
  return Number.isFinite(value) ? value : fallback;
}

function renderPrintSheet() {
  const printWidth = getNumber(elements.printWidth, 30);
  const printHeight = getNumber(elements.printHeight, 20);

  const sheetWidth = getNumber(elements.sheetWidth, 210);
  const sheetHeight = getNumber(elements.sheetHeight, 297);

  const horizontalGap = getNumber(elements.horizontalGap, 5);
  const verticalGap = getNumber(elements.verticalGap, 5);

  if (
    printWidth <= 0 ||
    printHeight <= 0 ||
    sheetWidth <= 0 ||
    sheetHeight <= 0
  ) {
    return;
  }

  const columns = Math.floor(
    (sheetWidth + horizontalGap) /
    (printWidth + horizontalGap)
  );

  const rows = Math.floor(
    (sheetHeight + verticalGap) /
    (printHeight + verticalGap)
  );

  const totalPrints = columns * rows;

  elements.printSheet.style.width = `${sheetWidth}mm`;
  elements.printSheet.style.height = `${sheetHeight}mm`;
  elements.printSheet.innerHTML = "";

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const printItem = document.createElement("div");

      printItem.className = `print-item ${selectedShape}`;

      if (elements.mirrorCheckbox.checked) {
        printItem.classList.add("mirrored");
      }

      printItem.style.width = `${printWidth}mm`;
      printItem.style.height = `${printHeight}mm`;
      printItem.style.left = `${column * (printWidth + horizontalGap)}mm`;
      printItem.style.top = `${row * (printHeight + verticalGap)}mm`;

      if (uploadedImage) {
        const image = document.createElement("img");
        image.src = uploadedImage;
        image.alt = "Uploaded chocolate design";
        printItem.appendChild(image);
      } else {
        const text = document.createElement("span");
        text.textContent = elements.textInput.value || "Your Name";
        printItem.appendChild(text);
      }

      elements.printSheet.appendChild(printItem);
    }
  }

  elements.printCount.textContent =
    `${totalPrints} print${totalPrints === 1 ? "" : "s"} ` +
    `(${columns} columns × ${rows} rows)`;
}

function setupShapeButtons() {
  const shapeButtons = document.querySelectorAll(".shape-button");

  shapeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      shapeButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");
      selectedShape = button.dataset.shape;

      renderPrintSheet();
    });
  });
}

function setupPhotoUpload() {
  elements.photoInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      uploadedImage = reader.result;
      renderPrintSheet();
    });

    reader.readAsDataURL(file);
  });

  elements.clearPhotoButton.addEventListener("click", () => {
    uploadedImage = "";
    elements.photoInput.value = "";
    renderPrintSheet();
  });
}

function setupLiveControls() {
  const controls = document.querySelectorAll(
    "input[type='text'], input[type='number'], input[type='checkbox']"
  );

  controls.forEach((control) => {
    control.addEventListener("input", renderPrintSheet);
    control.addEventListener("change", renderPrintSheet);
  });
}

function setupPrintButton() {
  elements.printButton.addEventListener("click", () => {
    window.print();
  });
}

setupShapeButtons();
setupPhotoUpload();
setupLiveControls();
setupPrintButton();
renderPrintSheet();