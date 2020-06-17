// 对象收编变量
// 全局变量 键值对
// var a = 1;
// var b = 10;

// function test () {}

// var obj = {
//   a: 1,
//   b: 10,
//   test: function () {},
// };

// initData
// 动画 animate 去管理所有动画函数
var bird = {
  skyPosition: 0,
  skyStep: 2,
  birdTop: 220,
  birdStepY: 0,
  startColor: 'blue',
  startFlag: false,
  minTop: 0,
  maxTop: 570,
  pipeLength: 7,
  pipeArr: [],
  pipeLastIndex: 6,
  score: 0,
  /**
   * 初始化函數
   */
  init: function () {
    this.initData();
    this.animate();
    this.handle();

    if(sessionStorage.getItem('play')) {
      this.start();
    }
  },
  initData: function () {
    this.el = document.getElementById('game');
    this.oBird = this.el.getElementsByClassName('bird')[0];
    this.oStart = this.el.getElementsByClassName('start')[0];
    this.oScore = this.el.getElementsByClassName('score')[0];
    this.oMask = this.el.getElementsByClassName('mask')[0];
    this.oEnd = this.el.getElementsByClassName('end')[0];
    this.oFinalScore = this.oEnd.getElementsByClassName('final-score')[0];
    this.oRankList = this.oEnd.getElementsByClassName('rank-list')[0];
    this.oRestart = this.oEnd.getElementsByClassName('restart')[0];


    this.scoreArr = this.getScore();
    console.log(this.scoreArr);
  },
  getScore: function () {
    var scoreArr = getLocal('score'); // 键值不存在 值为null
    return scoreArr ? scoreArr : [];

  },
  animate: function () {
    var count = 0;
    var self = this;

    this.timer = setInterval( function () {
      self.skyMove();

      if(self.startFlag) {
        self.birdDrop();
        self.pipeMove();
      }
      
      if(++ count % 10 === 0) {
        if(!self.startFlag) {
          self.birdJump();
          self.startBound();
        }
        self.birdFly(count);
      }
    }, 30)
  },
  /**
   * 天空移动
   */
  skyMove: function () {
    this.skyPosition -= this.skyStep;
    this.el.style.backgroundPositionX = this.skyPosition + 'px';
  },
  /**
   * 小鸟蹦
   */
  birdJump: function () {
    this.birdTop = this.birdTop === 220 ? 260 : 220;
    this.oBird.style.top = this.birdTop + 'px';
  },
  /**
   * 小鸟飞
   */
  birdFly: function (count) {
    this.oBird.style.backgroundPositionX = count % 3 * -30 + 'px';
  },
  birdDrop: function () {
    this.birdTop += ++ this.birdStepY;
    this.oBird.style.top = this.birdTop + 'px';
    this.judgeKnock();
    this.addScore();
  },
  pipeMove: function () {
    for(var i = 0; i < this.pipeLength; i ++) {
      var oUpPipe = this.pipeArr[i].up;
      var oDownPipe = this.pipeArr[i].down;
      var x = oUpPipe.offsetLeft - this.skyStep;

      if(x < - 52) {
        var lastPipeLeft = this.pipeArr[this.pipeLastIndex].up.offsetLeft;
        oUpPipe.style.left = lastPipeLeft + 300 + 'px';
        oDownPipe.style.left = lastPipeLeft + 300 + 'px';
        this.pipeLastIndex = ++ this.pipeLastIndex % this.pipeLength;

        // oUpPipe.style.height = upHeight + 'px';
        // oDownPipe.style.height = downHeight + 'px';

        continue;
      }
      oUpPipe.style.left = x + 'px';
      oDownPipe.style.left = x + 'px';
    }
  },
  getPipeHeight: function () {
    var upHeight = 50 + Math.floor(Math.random() * 175);
    var downHeight = 600 - 150 - upHeight;

    return {
      up: upHeight,
      down: downHeight,
    }
  },
  startBound: function () {
    var prevColor = this.startColor;
    this.startColor = prevColor === 'blue' ? 'white' : 'blue';

    this.oStart.classList.remove('start-' + prevColor);
    this.oStart.classList.add('start-' + this.startColor);
  },
  judgeKnock: function () {
    this.judgeBoundary();
    this.judgePipe();
  },
  /**
   * 进行边界碰撞检测
   */
  judgeBoundary: function () {
    if(this.birdTop < this.minTop || this.birdTop > this.maxTop) {
      this.failGame();
    }
  },
  /**
   * 进行柱子碰撞检测
   */
  judgePipe: function () {
    // 相遇 pipex = 95 pipeX =13
    var index = this.score % this.pipeLength;
    var pipeX = this.pipeArr[index].up.offsetLeft;
    var pipeY = this.pipeArr[index].y;
    var birdY = this.birdTop;

    if((pipeX <= 95 && pipeX >= 13) && (birdY <= pipeY[0] || birdY >= pipeY[1])) {
      this.failGame();
    }
  },
  addScore: function () {
    var index = this.score % this.pipeLength;
    var pipeX = this.pipeArr[index].up.offsetLeft;

    if(pipeX < 13) {
      this.oScore.innerText = ++ this.score;
    }
  },
  handle: function () {
    this.handleStart();
    this.handleClick();
    this.handleRestart();
  },
  handleStart: function () {
    this.oStart.onclick = this.start.bind(this);
  },
  start: function () {
    var self = this;
    self.startFlag = true;
    self.oBird.style.left = '80px';
    self.oBird.style.transition = 'none';
    self.oStart.style.display = 'none';
    self.oScore.style.display = 'block';
    self.skyStep = 5;

    for(var i = 0; i < self.pipeLength; i ++) {
      self.createPipe(300 * (i + 1));
    }
  },
  handleClick: function () {
    var self = this;
    this.el.onclick = function (e) {
      if(!e.target.classList.contains('start')) {
        self.birdStepY = -10;
      }
    };
  },
  handleRestart: function () {
    this.oRestart.onclick = function () {
      sessionStorage.setItem('play', true);
      window.location.reload();
    };
  },
  createPipe: function (x) {
    // var pipeHeight 0 - 1 600-150 = 450 / 2 = 225
    // (0 , 1) * 175 === 0, 175
    // 0 - 225 整数
    // 50 - 275 
    var upHeight = 50 + Math.floor(Math.random() * 175);
    var downHeight = 600 - 150 - upHeight;

    var oUpPipe = createEle('div', ['pipe', 'pipe-up'], {
      height: upHeight + 'px',
      left: x + 'px',
    })

    var oDownPipe = createEle('div', ['pipe', 'pipe-bottom'], {
      height: downHeight + 'px',
      left: x + 'px',
    })


    this.el.appendChild(oUpPipe);
    this.el.appendChild(oDownPipe);

    this.pipeArr.push({
      up: oUpPipe,
      down: oDownPipe,
      y: [upHeight, upHeight + 150],
    })
  },
  setScore: function () {
    this.scoreArr.push({
      score: this.score,
      time: this.getDate(),
    })

    this.scoreArr.sort(function (a, b) {
      return b.score - a.score;
    })

    setLocal('score', this.scoreArr);
  },
  getDate: function () {
    var d = new Date();
    var year = d.getFullYear();
    var month = formatNum(d.getMonth() + 1);
    var day = formatNum(d.getDate());
    var hour = formatNum(d.getHours());
    var minute = formatNum(d.getMinutes());
    var second = formatNum(d.getSeconds());

    return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
  },
  failGame: function () {
    clearInterval(this.timer);
    this.setScore();
    this.oMask.style.display = 'block';
    this.oEnd.style.display = 'block';
    this.oBird.style.display = 'none';
    this.oScore.style.display = 'none';
    this.oFinalScore.innerText = this.score;
    this.renderRankList();
  },
  renderRankList: function () {
    var template = '';
    for(var i = 0; i < 8; i ++) {
      var degreeClass = '';
      switch (i) {
        case 0:
          degreeClass = 'first';
          break;
        case 1:
          degreeClass = 'second';
          break;
        case 2:
          degreeClass = 'third';
          break;
      }

      template += `
        <li class="rank-item">
          <span class="rank-degree ${degreeClass}">${i + 1}</span>
          <span class="rank-score">${this.scoreArr[i].score}</span>
          <span class="rank-time">${this.scoreArr[i].time}</span>
        </li>
      `;
    }

    this.oRankList.innerHTML = template;
  },
};




