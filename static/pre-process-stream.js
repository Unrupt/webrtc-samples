var AudioContext = window.AudioContext || window.webkitAudioContext;
var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

var localStream;
var gainNode;
var ctx;
var dst;
var audioMuted = false;

var start = () => navigator.mediaDevices.getUserMedia({audio: true})
  .then(stream => audio.srcObject = editStream(stream))
  .catch(e => log(e));

var editStream = (stream) => {
    localStream = stream;
    ctx = new AudioContext();
    var src = ctx.createMediaStreamSource(stream);
    dst = ctx.createMediaStreamDestination();
    processor = ctx.createScriptProcessor(4096, 1, 1);
    src.connect(processor);
    processor.connect(dst);
    outputStream = dst.stream;
    
    stream.addTrack(outputStream.getAudioTracks()[0]);
    stream.removeTrack(stream.getAudioTracks()[0]);

    //[src, gainNode, dst].reduce((a, b) => a && a.connect(b));

    processor.onaudioprocess = function(ape) {
        var inputBuffer = ape.inputBuffer;

        var outputBuffer = ape.outputBuffer;

        // Loop through the output channels (in this case there is only one)
        if (inputBuffer.numberOfChannels == 1) {
            var inputData = inputBuffer.getChannelData(0);
            var outputData = outputBuffer.getChannelData(0);
            // Loop through the 4096 samples
            var avg = 0.0;

            for (var sample = 0; sample < inputBuffer.length; sample++) {
                // make output equal to the same as the input
                if ( audioMuted ) {
                    outputData[sample] = inputData[sample] * 0.1;
                }else {
                    outputData[sample] = inputData[sample];
                }
                avg += Math.abs(outputData[sample]); // sample
            }
            avg = avg / inputBuffer.length;
            var silent = (avg < 0.0175);
            console.log("Silence: " + silent);
        }
    };

    return stream;
};

var toggleMute = (el) => {
    audioMuted = !audioMuted;
    el.innerHTML = (audioMuted)? "Unmute" : "Mute";
};

var log = msg => div.innerHTML += "<br>" + msg;
