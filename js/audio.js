  var AudioVisualize = function (settings) {//settings = {'frequencyValue','fftSize','smoothungTimeConstant'}
    'use strict';
    settings = settings || {};
    var self = this,
        fileReader   = new FileReader(),

        // Safariでも動く
        AudioContext = window.AudioContext || window.webkitAudioContext,
        audioContext = new AudioContext(),

        //renderでAve,differenceをdivに描画するかどうか
        ave_diffShowJudge = false,

        preAve = 0,
        spectrumCounts = 0,
        spectrums,

        source,
        animationId,
        filter;

    this.difference = 0;
    this.ave = 0;

    //マイク確認用
    filter = audioContext.createBiquadFilter();
    //filter.type = 0;
    filter.frequency.value = (settings.frequencyValue !== undefined) ? settings.frequencyValue : 440;
    console.log(filter.frequency.value);

    this.mic = function () {//マイク使えるか確認
      var audioObj = { /*video: true,*/ audio: true},

          //エラー処理
          errBack = function (e) {
            console.log('audioVisualjs error:', e.code);
          };

      //WebAudioリクエスト成功時に呼び出されるコールバック関数
      function gotStream(stream) {
        //streamからAudioNodeを作成
        var mediaStreamSource = audioContext.createMediaStreamSource(stream);

        mediaStreamSource.connect(filter);

        filter.connect(self.analyser);

        self.animationJudge = true;
      }


      //マイクの有無を調べる
      navigator.getUserMedia = ( navigator.getUserMedia ||
                                navigator.webkitGetUserMedia ||
                                navigator.mozGetUserMedia ||
                                navigator.msGetUserMedia);

      if (navigator.getUserMedia) {
        //マイク使って良いか聞いてくる
        navigator.getUserMedia(audioObj, gotStream, errBack);
      } else {
          alert('マイクデバイスがありません');
      }
    };
    //マイク確認用end


    self.analyser = audioContext.createAnalyser();
    self.analyser.fftSize = settings.fftSize || 1024;
    self.analyser.smoothingTimeConstant = settings.smoothingTimeConstant || 0.8;//defoult:0.8
    self.analyser.connect(audioContext.destination);



    fileReader.onload = function () {
      console.log('onload');
      audioContext.decodeAudioData(fileReader.result, function (buffer) {
        if (source) {
          source.stop();
          self.animationJudge = false;
        }

        source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(self.analyser);
        source.start(0);

        self.animationJudge = true;
      });
    };


    this.addInputDom = function () {
      var inputDom = $('<input>').attr('id', 'file').attr('type', 'file').attr('accept', 'audio/*');
      $('body').append(inputDom);
    };



    this.addChangeEvent = function () {//これないとうごかない
      $('#file').on('change', function (e) {
        console.log('onchange');
        fileReader.readAsArrayBuffer(e.target.files[0]);
      });
    };



    this.addAveDifferenceDom = function () {
      var aveDom = $('<div>').attr('id', 'Ave'),
          differenceDom = $('<div>').attr('id', 'difference');
      $('body').append(differenceDom).append(aveDom);
      ave_diffShowJudge = true;
    };

    this.render = function () {
      if (self.animationJudge) {
        spectrumCounts = 0;
        this.ave = 0;
        var i = 0, len = 0;
        spectrums = new Uint8Array(self.analyser.frequencyBinCount);

        self.analyser.getByteFrequencyData(spectrums);

        for (i = 0, len = spectrums.length; i < len; i++) {
          this.ave += spectrums[i];
          if (spectrums[i] !== 0) {
            spectrumCounts++;
          }
        }

        if (spectrumCounts !== 0) {
          this.ave = this.ave / spectrumCounts;//(spectrums.length-1);// this.ave/i と同

          this.difference = this.ave - preAve;
          preAve = this.ave;

          if (ave_diffShowJudge) {
            $('#difference').text('diffrrence: ' + this.difference);
            $('#Ave').text('Ave: ' + this.ave);
          }
        }
      }
      animationId = window.requestAnimationFrame(this.render.bind(this));
    };//render
  };

  window.AudioVisualize = AudioVisualize;
