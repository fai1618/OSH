
$(function(){
  'use strict';
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
    this.life = Math.round(getRandom(50,400));
  };

  CircleMaker.prototype.lifeJudge = function(intervalId){
    if(--this.life > 0){
      if(this.life <= 500){
        if(this.life < 100){
          if(this.life < 50){
            this.color = this.colorFadeOut(9/10);
          }else{
            this.color = this.colorFadeOut(99/100);
          }
        }else{
          this.color = this.colorFadeOut(999/1000);
        }
      }
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

  //10進数に変換->int倍する->16進数に変換
  //TODO:暗くするんじゃなくて、薄くする(それぞれの値を小さくするのではダメ)
  CircleMaker.prototype.colorFadeOut = function(int){
    var color = ''+this.color;
    var r = color.slice(1,3);
    var g = color.slice(3,5);
    var b = color.slice(5,7);
    r = parseInt(r,16).toString(10)*1;
    g = parseInt(g,16).toString(10)*1;
    b = parseInt(b,16).toString(10)*1;

    r = Math.round(r*int).toString(16);
    g = Math.round(g*int).toString(16);
    b = Math.round(b*int).toString(16);

    if(r.toString(16).length < 2){
      r = "0"+r;
    }
    if(g.toString(16).length < 2){
      g = "0"+g;
    }
    if(b.toString(16).length < 2){
      b = "0"+b;
    }
    return '#'+r+g+b;
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
    maxY = $(canvasDom).height();
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
