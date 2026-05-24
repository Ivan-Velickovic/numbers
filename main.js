const input = document.getElementById("input");

const sizeText = document.getElementById("size");
const decText = document.getElementById("dec");
const hexText = document.getElementById("hex");
const binaryText = document.getElementById("binary");
const binaryCtzText = document.getElementById("binary-ctz");
const binaryClzText = document.getElementById("binary-clz");
const bits = document.getElementById("bits");

function getHistory() {
    if (window.localStorage.getItem("history") != null) {
        return window.localStorage.getItem("history");
    } else {
        return "";
    }
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
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

function bitDiv(value, index) {
    let bit = document.createElement("div");
    bit.className = "bit";

    let bitValue = document.createElement("p");
    bitValue.className = "bit-value";
    bitValue.textContent = value;

    let bitIndex = document.createElement("p");
    bitIndex.className = "bit-index";
    bitIndex.textContent = index;

    bit.appendChild(bitValue);
    bit.appendChild(bitIndex);

    return bit;
}

function update(value) {
  var n;

  value = valueFromString(value);

  console.log(value);

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
  binaryText.textContent = "0b" + n.toString(2);
  while (bits.firstChild) {
        bits.removeChild(bits.lastChild);
  }
  let bitString = n.toString(2);
  // for (let i = bitString.length - 1; i >= 0; i--) {
  //   bits.appendChild(bitDiv(bitString[i], i));
  // }
  for (let i = 0; i < bitString.length; i++) {
    let b = bitDiv(bitString[i], bitString.length - i - 1);

    b.addEventListener("click", (e) => {
        console.log(bitString);
        var updated;
        if (bitString[i] == '0') {
            updated = bitString.replaceAt(i, '1');
        } else if (bitString[i] == '1') {
            updated = bitString.replaceAt(i, '0');
        }
        update("0b" + updated);
        console.log(updated);
    });

    if (bitString.length > 1 && i % 2 != 0 && i != 0) {
        b.children[0].style.borderLeft = 0;

        if (i != bitString.length - 1) {
            b.children[0].style.borderRight = 0;
        }
    }
    bits.appendChild(b);
  }

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
