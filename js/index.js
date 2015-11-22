
$(function(){
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  var canvasDom = $("<canvas/>")[0];
  $(canvasDom).css("width",$(window).width());
  $(canvasDom).css("height",$(window).height()*0.99);
  $("body").append(canvasDom);
  var canvasContext = canvasDom.getContext('2d');
  $(canvasDom).attr("height",$(window).height());
  $(canvasDom).attr("width",$(window).width());

  var bgColor = '#000000';
  var maxX = $(canvasDom).width();
  console.log(maxX);
  var maxY = $(canvasDom).height();
  console.log(maxY);

  var circles = [];
  var render;
  var CircleMaker;

  //minからmaxまでの乱数を返す関数
  function getRandom(min, max){
    return Math.random()*(max-min)+min;
  }

  function getRandomColor(){
    return '#'+Math.floor(Math.random() * 0xFFFFFF).toString(16);
  }

  CircleMaker = function (x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;

    this.velocity = {
      x:0,
      y:0,
      radius:1.0,
    };
    this.life = Math.round(getRandom(50,500));
  };

  CircleMaker.prototype.lifeJudge = function(intervalId){
    if(--this.life > 0){
    }else{
      if(this.life === 0){
        console.log('dead');
        this.color = bgColor;
      }
    }
  };

  CircleMaker.prototype.draw = function(x, y, radius, color){
    if(color !== bgColor){
      canvasContext.strokeStyle = color;
      canvasContext.beginPath();
      canvasContext.arc(x, y, radius, 0, 2*Math.PI, true);
      canvasContext.stroke();
    }
  };

  CircleMaker.prototype.move = function(){
    if(this.life > 0){
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.radius += this.velocity.radius;
    }
  };


  function onClick(e) {
    var x = 0;
    var y = 0;
    /*
      rectでcanvasの絶対座標位置を取得し、
      クリック座標であるe.clientX,e.clientYからその分を引く
      ※rectはスクロールによって値が変わるから関数内でその都度定義
     */
    var rect = e.target.getBoundingClientRect();
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;

    console.log('x:'+x+', y:'+y);

    circles.push(new CircleMaker(x, y, 1, getRandomColor()));
  }
  $(canvasDom).click(onClick);


  $(window).resize(function() {
      console.log('resized');
    $(canvasDom).css("width",$(window).width());
    $(canvasDom).css("height",$(window).height()*0.99);
    $(canvasDom).attr("height",$(window).height());
    $(canvasDom).attr("width",$(window).width());

    //TODO:これで不具合ないか確認(画面の大きさ変えた時に) <- 使うの一瞬だから大丈夫？
    maxX = $(canvasDom).width();
    console.log(maxX);
    maxY = $(canvasDom).height();
    console.log(maxY);
  });


  render = function(){
    //canvasContext.clearRect(0, 0, canvasDom.width, canvasDom.height);
    canvasContext.fillStyle = bgColor;
    canvasContext.fillRect( 0, 0, canvasDom.width, canvasDom.height);

    circles.forEach(function(element){
      element.move();
      element.draw(element.x, element.y, element.radius, element.color);
      element.lifeJudge();
    });

    requestAnimationFrame(render);
  };
  render();

});
