'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
  movementsDates: [
    '2024-02-07T21:31:17.178Z',
    '2024-02-13T07:42:02.383Z',
    '2024-02-15T09:15:04.904Z',
    '2024-02-19T23:36:17.929Z',
    '2024-02-27T10:51:36.790Z',
    '2024-02-29T10:17:24.185Z',
    '2024-03-01T14:11:59.604Z',
    '2024-03-04T17:01:17.194Z',
  ],
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  pin: 4444,
};

// const accounts = [account1, account2, account3, account4];
const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];



const createUserNames = function (accounts) {
  accounts.forEach(acc => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);
const dateFormat = (date) =>{
  const calcDays = (date1, date2) =>{
    return Math.round(Math.abs(date1 - date2)/(1000 * 60 * 60 * 24))
  }

  const dayPassed = calcDays(new Date() ,date);
  if(dayPassed === 0) return 'Today';
  else if(dayPassed === 1) return 'Yesterday';
  else if(dayPassed <= 7) return `${dayPassed} days`;
  else {
    // const year = date.getFullYear();
    // const month = `${date.getMonth() + 1}`.padStart(2,0);
    // const day = `${date.getDate()}`.padStart(2,0);
    // const displayDate =  `${day}/${month}/${year}`;
    // return displayDate;
    return new Intl.DateTimeFormat('en-IN').format(date);
  }
}


const formatCurrency = (value)=>{
  return new Intl.NumberFormat('us-IN' , {
    style : "currency",
    currency : 'INR'
  }).format(value);
}
const displayMovements = function (acc, sort) {
  containerMovements.innerHTML = '';
  // we use slice here because we want a copy of movements and wants to chain methods
  const transactions = sort
    ? acc.movements?.slice().sort((a, b) => a - b)
    : acc.movements;
  transactions.forEach(function (mov, i) {

    // displaying dates
    const date = new Date(acc.movementsDates[i]);
   

    const type = mov > 0 ? 'deposit' : 'withdrawal';
    mov = mov.toFixed(2);
    const html = `<div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${dateFormat(date)}</div>
      <div class="movements__value">${mov} Rs</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const calcDisplayMovements = function (acc) {
  acc.balance = acc.movements.reduce((sum, el) => {
    return sum + el;
  }, 0);

  labelBalance.textContent = `${acc.balance.toFixed(2)} Rs`;
};
const calcSummary = function (movements) {
  let totalOut = 0,
    totalIn = 0;
  movements.forEach(el => {
    if (el > 0) {
      totalIn += el;
    } else {
      totalOut += el;
    }
  });
  labelSumIn.textContent = `${totalIn.toFixed(2)} Rs`;
  labelSumOut.textContent = `${((-totalOut).toFixed(2))} Rs`;
};

const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayMovements(acc);
  calcSummary(acc.movements);
};



// implementing login
let currentAcc;
btnLogin.addEventListener('click', e => {
  // this will prevent auto submitting of form
  e.preventDefault();

  currentAcc = accounts.find(acc => {
    return acc.userName === inputLoginUsername.value;
  });

  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome, ${currentAcc.owner.split(' ')[0]}`;
    updateUI(currentAcc);
    containerApp.style.opacity = '100';
  }

  // Displaying label date
  labelDate.textContent =  Intl.DateTimeFormat('en-IN').format(new Date());


  // to clear input field
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur(); // this will remove the blinking of login pin input button
});

// implementing transfer
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  if (
    receiverAcc &&
    amount > 0 &&
    amount < currentAcc.balance &&
    receiverAcc.userName !== currentAcc.userName
  ) {
    currentAcc.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAcc.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    console.log(accounts);
    updateUI(currentAcc);
    
  }

  // clearing input field
  inputTransferAmount.blur();
  inputTransferAmount.value = inputTransferTo.value = '';
});

// implementing closing account
btnClose.addEventListener('click', e => {
  e.preventDefault();

  // checking the credentials
  if (
    inputCloseUsername.value === currentAcc.userName &&
    Number(inputClosePin.value) === currentAcc.pin
  ) {
    const index = accounts.find(acc => acc.userName === currentAcc.value);

    accounts.splice(index, 1);
    containerApp.style.opacity = '0';
    labelWelcome.textContent = `Log in to get started`;
  }
});




// test login
let currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;