import anime from '/node_modules/animejs/lib/anime.es.js';
import { createArray, createGridTemplate } from '/helpers.js';

const settings = {
  status: false,
  timeLimit: 1,
  width: '400px',
  height: '260px',
  columns: 4,
  rows: 4
}

class MatchGrid {
  constructor({
    status,
    timeLimit,
    height,
    width,
    columns,
    rows
  }) {
    this.status = status;
    this.time = timeLimit;
    this.size = columns * rows;
    this.height = height;
    this.width = width;
    this.columns = columns;
    this.rows = rows;

    this.numbersArray;
    this.firstEl;
    this.secondEl;
    this.match = 0;

    this.gameContainer = document.getElementById('game');
    this.start = document.getElementById('start');
    this.reset = document.getElementById('reset');
    this.modal = document.getElementById('modal');
  }

  defineStatus(status) {
    this.status = status;

    clearInterval(this.interval);
    this.gameSettings();
    this.game();
  }

  gameSettings() {
    this.gameContainer.style.width = this.width;
    this.gameContainer.style.height = this.height;

    this.gameContainer.style.gridTemplateColumns = createGridTemplate(this.columns);
    this.gameContainer.style.gridTemplateRows = createGridTemplate(this.rows);
  }

  game() {
    if (this.status) {
      this.start.style.display = 'none';
      this.start.innerText = 'Retry';
      this.reset.style.display = 'flex';

      this.numbersArray = createArray(this.columns, this.rows);
      
      document
        .getElementById('buttonsContainer')
        .style.justifyContent = 'space-between'; 

      this.checkIsInGame();

      this.gameContainer.style.removeProperty('display');
      
      let i = 0;
      do {
        i = i + 1;

        let item = document.createElement('div');
        item.id = this.numbersArray[i - 1];
        item.textContent = this.numbersArray[i - 1];
        item.classList = `item${i}`;

        this.gameContainer.appendChild(item);

        item.addEventListener('click', () => this.checkIfSame(item, this.size));
      } while (i < this.size);

    } else if (!this.status) {
      this.start.style.display = 'flex';
      this.reset.style.display = 'none';

      this.gameContainer.innerHTML = '';
      this.gameContainer.style.display = 'none';

      document
        .getElementById('buttonsContainer')
        .style.justifyContent = 'center'; 

      document.getElementById('timerWrapper').hasChildNodes()
       && document.getElementById('timer').remove();
    }
  }

  checkIsInGame() {
    let isInGame = true;
    const app = document.getElementById('appWrapper');

    app.addEventListener('mouseenter', () => isInGame = true);
    app.addEventListener('mouseleave', () => isInGame = false);

    this.timer(isInGame);
  }

  timer(isInGame) {
    let timer = document.createElement('div');
    timer.id = 'timer';
    timer.innerText = 'Ready?';
    
    document
      .getElementById('timerWrapper')
      .appendChild(timer);
    
    const date = new Date();
    const newDate = this.addMinutes(date, this.time);

    let compensator = 0;

    this.interval = setInterval(() => {
      let now = new Date().getTime();
      let timeleft = newDate - now + 1000;
      let seconds = Math.floor((timeleft % (1000 * 60)) / 1000) + compensator;

      if (isInGame) {
        timer.innerText = `Time: ${seconds}`;
      } else {
        ++compensator;
      }

      if (0 > seconds) {
        this.status && this.openModal('You lost &#128542');
        this.defineStatus(false);
        timer.remove();
      }
    }, 1000);
  }

  checkIfSame(el, size) {
    this.colorAnime(el.className, '#d17312');

    if (!this.firstEl) {
      this.firstEl = el;
      this.firstEl.style.pointerEvents = 'none';
    } else {
      this.secondEl = el;
      this.secondEl.style.pointerEvents = 'none';

      document.getElementById('game').classList.add('noEvents');

      setTimeout(() => {
        if (this.firstEl.id === this.secondEl.id) {
          ++this.match;

          this.firstEl.style.visibility = 'hidden';
          this.secondEl.style.visibility = 'hidden';

          if (size === this.match * 2) {
            this.defineStatus(false);

            this.match = 0;
    
            document.getElementById('timerWrapper').hasChildNodes()
              && document.getElementById('timer').remove();

            this.openModal('You Won! &#127881');
          }
        } else {
          this.colorAnime(this.firstEl.className, '#12572b');
          this.colorAnime(this.secondEl.className, '#12572b');
        }
        document.getElementById('game').classList.remove('noEvents');

        this.firstEl.style.pointerEvents = 'auto';
        this.secondEl.style.pointerEvents = 'auto';

        this.firstEl = undefined;
        this.secondEl = undefined;
      }, 1000);
    }  
  }

  addMinutes(date, minutes) {
    date.setMinutes(date.getMinutes() + minutes);
  
    return date;
  };

  colorAnime(target, color) {
    anime({
      targets: `.${target}`,
      background: color
    });
  };

  openModal(text) {
    this.modal.classList.remove('hidden');
    this.modal.innerHTML = text;

    setTimeout(() => {
      this.closeModal();
    }, 2000);
  };

  closeModal() {
    this.modal.classList.add('hidden');
  };
}

const memoryGame = new MatchGrid(settings);

memoryGame.game();

document
  .getElementById('start')
  .addEventListener('click', () => memoryGame.defineStatus(true));

document
  .getElementById('reset')
  .addEventListener('click', () => memoryGame.defineStatus(false));
