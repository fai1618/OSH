  var AudioVisualize = function (settings) {//settings = {'frequencyValue','fftSize','smoothungTimeConstant'}
    'use strict';
    var spectrumCounts = 0,
        source,
        spectrums,
        animationId;

    this.settings = settings || {};
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.fileReader   = new FileReader(),

    //renderでAve,differenceをdivに描画するかどうか
    this.ave_diffShowJudge = false
    this.difference = 0;
    this.ave = 0;

    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = this.settings.fftSize || 1024;
    this.analyser.smoothingTimeConstant = this.settings.smoothingTimeConstant || 0.8;//defoult:0.8
    this.analyser.connect(this.audioContext.destination);

    this.fileReader.onload = function () {
      var self = this;
      console.log('onload');
      self.audioContext.decodeAudioData(self.fileReader.result, function (buffer) {
        if (source) {
          source.stop();
          self.animationJudge = false;
        }
        source = self.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(self.analyser);
        source.start(0);

        self.animationJudge = true;
      });
    };


    this.render = function () {
      var self = this;
      if(!this.render.preAve){
        this.render.preAve = 0;
      }
      if (this.animationJudge) {
        spectrumCounts = 0;
        this.ave = 0;
        var i = 0, len = 0;
        spectrums = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(spectrums);

        for (i = 0, len = spectrums.length; i < len; i++) {
          this.ave += spectrums[i];
          if (spectrums[i] !== 0) {
            spectrumCounts++;
          }
        }

        if (spectrumCounts !== 0) {
          this.ave = self.ave / spectrumCounts;//(spectrums.length-1);// this.ave/i と同
          this.difference = this.ave - this.render.preAve;
          this.render.preAve = this.ave;
          if (this.ave_diffShowJudge) {
            $('#difference').text('diffrrence: ' + this.difference);
            $('#Ave').text('Ave: ' + this.ave);
          }
        }
      }
      animationId = window.requestAnimationFrame(this.render.bind(this));
    };//render
  };










AudioVisualize.prototype.mic = function () {//マイク使えるか確認
  var filter,self = this,audioObj;
  //マイク確認用
  filter = this.audioContext.createBiquadFilter();
  //filter.type = 0;
  filter.frequency.value = (this.settings.frequencyValue !== undefined) ? this.settings.frequencyValue : 440;
  console.log(filter.frequency.value);
  audioObj = { /*video: true,*/ audio: true};

  //エラー処理
  function errBack(e) {
    console.log('audioVisualjs error:', e.code);
  };
  //WebAudioリクエスト成功時に呼び出されるコールバック関数
  function gotStream(stream) {
    //streamからAudioNodeを作成
    var mediaStreamSource = self.audioContext.createMediaStreamSource(stream);
    mediaStreamSource.connect(filter);
    filter.connect(self.analyser);
    self.animationJudge = true;
  }

  //マイクの有無を調べる
  navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia);

  if (navigator.getUserMedia) {
    //マイク使って良いか聞いてくる
    navigator.getUserMedia(audioObj, gotStream, errBack);
  } else {
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
      navigator.mediaDevices.getUserMedia(audioObj, gotStream, errBack);
    }else{
      alert('マイクデバイスがありません');
    }
  }
};
//マイク確認用end


AudioVisualize.prototype.addChangeEvent = function () {//これないとうごかない
  var self = this;
  $('#file').on('change', function (e) {
    console.log('onchange');
    self.fileReader.readAsArrayBuffer(e.target.files[0]);
  });
};


AudioVisualize.prototype.addAveDifferenceDom = function () {
  var aveDom = $('<div>').attr('id', 'Ave'),
      differenceDom = $('<div>').attr('id', 'difference');
  $('body').append(differenceDom).append(aveDom);
  this.ave_diffShowJudge = true;
};


AudioVisualize.prototype.addInputDom = function () {
  var inputDom = $('<input>').attr('id', 'file').attr('type', 'file').attr('accept', 'audio/*');
  $('body').append(inputDom);
};
