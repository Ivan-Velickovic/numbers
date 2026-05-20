const input = document.getElementById("input");

const sizeText = document.getElementById("size");
const decText = document.getElementById("dec");
const hexText = document.getElementById("hex");
const binaryText = document.getElementById("binary");
const binaryCtzText = document.getElementById("binary-ctz");
const binaryClzText = document.getElementById("binary-clz");

function getHistory() {
    if (window.localStorage.getItem("history") != null) {
        return window.localStorage.getItem("history");
    } else {
        return "";
    }
}

let history = getHistory();
updateHistory();

if (input.value.length !== 0) {
    update(input.value)
}

input.addEventListener("input", (e) => update(e.target.value));

const historyClearBtn = document.getElementById("history-clear");
historyClearBtn.addEventListener("click", (e) => {
    localStorage.clear();
    history = getHistory();
    updateHistory();
});

function valueFromString(value) {
    return value.replaceAll("_", "");
}

input.onblur = function() {
    if (input.value.length !== 0) {
        const currentValue = valueFromString(input.value);
        const currentValues = history.split("\n");
        for (let val of currentValues) {
            if (val === currentValue) {
                return;
            }
        }
        history += "\n" + currentValue;
        updateHistory();
        window.localStorage.setItem("history", history);
    }
}

function toSize(n) {
    if (n > 1024 * 1024 * 1024 * 1024) {
        human_num = n / 1024 / 1024 / 1024 / 1024
        s = "TiB"
    } else if (n > 1024 * 1024 * 1024) {
        human_num = n / 1024 / 1024 / 1024
        s = "GiB"
    } else if (n > 1024 * 1024) {
        human_num = n / 1024 / 1024
        s = "MiB"
    } else if (n > 1024) {
        human_num = n / 1024
        s = "KiB"
    } else {
        human_num = n
        if (n == 1) {
            s = " byte"
        } else {
            s = " bytes"
        }
    }

    return human_num + s;
}

function binaryString(n) {
   let str = n.toString(2);
   str = str.padStart(64, "0");

   return "0b" + str;
}

function updateBinaryText(value) {
    while (binaryText.firstChild) {
        binaryText.removeChild(binaryText.lastChild);
    }

    const s = binaryString(value);
}

function update(value) {
  var n;

  value = valueFromString(value);

  if (value.startsWith("0x")) {
    n = parseInt(value.slice(2), 16);
  } else if (value.startsWith("0b")) {
    n = parseInt(value.slice(2), 2);
  } else {
    n = parseInt(value);
  }

  sizeText.textContent = toSize(n);
  decText.textContent = n.toString(10);
  hexText.textContent = "0x" + n.toString(16);
  // binaryText.textContent = binaryString(n);

  updateBinaryText(n);

  // binaryCtzText.textContent = "ctz: " + Math.ctz32(n);
  // binaryClzText.textContent = "clz: " + Math.clz32(n);
}

function updateHistory() {
    const historyValues = document.getElementById("history-values");
    while (historyValues.firstChild) {
        historyValues.removeChild(historyValues.lastChild);
    }
    for (let val of history.split("\n")) {
        const historyValue = document.createElement("p");
        historyValue.className = "history-value";
        historyValue.textContent = val;
        historyValue.addEventListener("click", () => {
            update(val);
            input.value = val;
        });
        historyValues.appendChild(historyValue);
    }
}

function leadingZeros(bits, value) {
    const valueString = value.toString();
    const n = valueString.indexOf(1);
    // const s = valueString.padStart(bits - valueString.length)
}
