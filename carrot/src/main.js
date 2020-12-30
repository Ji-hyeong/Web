'use strict';
import Field from './field.js';
import PopUp from './popup.js';
import * as sound from './sound.js';

const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

let started = false;
let score = 0;
let timer = undefined;

const gameFinishBanner = new PopUp();
const gameField = new Field(CARROT_COUNT,BUG_COUNT);
gameField.setClickListener(onItemClick);

function onItemClick(item){
  console.log('111')
  if (!started) return;
  if(item === 'carrot'){
    score++;
    updateScoreBoard();
    if(score === CARROT_COUNT){
      finishGame(true);
    }
  }
  else{
    finishGame(false);
  }
}

gameFinishBanner.setClickListener(()=>{
  startGame();
})
gameBtn.addEventListener('click', ()=>{
  if(started){
    stopGame();
  }
  else{
    startGame();
  }
})

function startGame(){
  started=true;
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  sound.playBackground();
}

function stopGame(){
  started=false;
  stopGameTimer();
  hideGameButton();
  sound.stopBackground();
  sound.playAlert();
  gameFinishBanner.showWithText('REPLAY😊');
}

function finishGame(win){
  started=false;
  hideGameButton();
  if (win){
    sound.playWin();
  }
  else{
    sound.playBug();
  }
  stopGameTimer();
  sound.stopBackground();
  gameFinishBanner.showWithText(win? 'YOU WON😃' : 'YOU LOST😒');
}

function showStopButton(){
  const icon = gameBtn.querySelector('.fas');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
  gameBtn.style.visibility= 'visible';
}

function hideGameButton(){
  gameBtn.style.visibility= 'hidden';
}

function showTimerAndScore(){
  gameTimer.style.visibility = 'visible';
  gameScore.style.visibility = 'visible';
}

function startGameTimer(){
  let remaningTimeSec = GAME_DURATION_SEC;
  updateTimerText(remaningTimeSec);
  timer = setInterval(()=>{
    if(remaningTimeSec <= 0){
      clearInterval(timer);
      finishGame(CARROT_COUNT === score);
      return;
    }
    updateTimerText(--remaningTimeSec);
  },1000);
}

function stopGameTimer(){
  clearInterval(timer);
}

function updateTimerText(time){
  const minutes = Math.floor(time/60);
  const seconds = time % 60;
  gameTimer.innerText = `${minutes}:${seconds}`
}


function initGame(){
  score=0;
  gameScore.innerText = CARROT_COUNT;
  gameField.init();
}


function updateScoreBoard(){
  gameScore.innerText = CARROT_COUNT - score;
}