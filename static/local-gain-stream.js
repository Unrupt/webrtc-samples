var AudioContext = window.AudioContext || window.webkitAudioContext;
var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

var localStream;
var gainNode;
var ctx;
var dst;
var start = () => navigator.mediaDevices.getUserMedia({audio: true})
  .then(stream => audio.srcObject = modifyGain(stream, 2.5))
  .catch(e => log(e));

var modifyGain = (stream, gainValue) => {
    localStream = stream;
  ctx = new AudioContext();
  var src = ctx.createMediaStreamSource(stream);
  dst = ctx.createMediaStreamDestination();
  gainNode = ctx.createGain();
  gainNode.gain.value = gainValue;
  src.connect(gainNode);
  gainNode.connect(dst);
  outputStream = dst.stream;
  stream.addTrack(outputStream.getAudioTracks()[0]);
  stream.removeTrack(stream.getAudioTracks()[0]);

  //[src, gainNode, dst].reduce((a, b) => a && a.connect(b));
  return stream;
};

var updateGain = (value) => {
  gainNode.gain.value = value;
};

var log = msg => div.innerHTML += "<br>" + msg;
