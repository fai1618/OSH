//minからmaxまでの乱数を返す関数
function getRandom(min, max){
  'use strict';
  return Math.random()*(max-min)+min;
}

function getRandomColor(){
  'use strict';
  var r = Math.round(Math.random()*(256-50))+50;
  if(r/16 < 1){
    r = r.toString(16);
    r = "0"+r;
  }else{
    r = r.toString(16);
  }
  var g = Math.round(Math.random()*(256-50))+50;
  if(g/16 < 1){
    g = g.toString(16);
    g = "0"+g;
  }else{
    g = g.toString(16);
  }
  var b = Math.round(Math.random()*(256-50))+50;
  if(b/16 < 1){
    b = b.toString(16);
    b = "0"+b;
  }else{
    b = b.toString(16);
  }
  return '#'+r+g+b;
}
