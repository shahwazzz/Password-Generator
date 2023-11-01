const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercasecheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "~!@#$%^&*()_}{[]|\><?/";

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength color to grey
setIndicator("#ccc");

//set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerHTML = passwordLength;
    //or kuch bhi karna chahiye ? - HW
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRndNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum)
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercasecheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNumber = true;
    if (symbolsCheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    }

    else if ((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength >= 6) {
        setIndicator("#ff0");
    }

    else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);

}

function shufflePassword(array) {
    //Fisher Yates method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;

    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxchange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    })

    //special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxchange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected
    if (checkCount == 0) {
        return;
    }

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    //let's find the password

    //remove old password
    password = "";


    let funArr = [];

    if (uppercasecheck.checked) {
        funArr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {
        funArr.push(generateLowerCase);
    }
    if (numbersCheck.checked) {
        funArr.push(getRndNumber);
    }
    if (symbolsCheck.checked) {
        funArr.push(generateSymbol);
    }

    //compulsory addition
    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i]();
    }

    //remaning addition
    for (let i = 0; i < passwordLength - funArr.length; i++) {
        let randIndex = getRndInteger(0, funArr.length);
        password += funArr[randIndex]();
    }

    //shuffle password 
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;

    //calc strength
    calcStrength();
})