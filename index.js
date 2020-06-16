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
  /**
   * 初始化函數
   */
  init: function () {
    this.initData();
    this.animate();
    this.handle();
  },
  initData: function () {
    this.el = document.getElementById('game');
    this.oBird = this.el.getElementsByClassName('bird')[0];
    this.oStart = this.el.getElementsByClassName('start')[0];
    this.oScore = this.el.getElementsByClassName('score')[0];
    this.oMask = this.el.getElementsByClassName('mask')[0];
    this.oEnd = this.el.getElementsByClassName('end')[0];




  },
  animate: function () {
    var count = 0;
    var self = this;

    this.timer = setInterval( function () {
      self.skyMove();

      if(self.startFlag) {
        self.birdDrop();
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
  judgePipe: function () {},
  handle: function () {
    this.handleStart();
  },
  handleStart: function () {
    var self = this;

    this.oStart.onclick = function () {
      self.startFlag = true;
      self.oBird.style.left = '80px';
      self.oStart.style.display = 'none';
      self.oScore.style.display = 'block';
      self.skyStep = 5;
    };
  },
  failGame: function () {
    clearInterval(this.timer);
    this.oMask.style.display = 'block';
    this.oEnd.style.display = 'block';
    this.oBird.style.display = 'none';
    this.oScore.style.display = 'none';
  },
};




