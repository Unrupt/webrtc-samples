
var AudioContext = window.AudioContext || window.webkitAudioContext;
var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;


function GainController(stream) {

    // set our starting value
    this.gain = 1;
    var context = this.context = new AudioContext();
    this.microphone = context.createMediaStreamSource(stream);
    this.gainFilter = context.createGain();
    this.destination = context.createMediaStreamDestination();
    this.outputStream = this.destination.stream;
    this.microphone.connect(this.gainFilter);
    this.gainFilter.connect(this.destination);
    stream.addTrack(this.outputStream.getAudioTracks()[0]);
    stream.removeTrack(stream.getAudioTracks()[0]);
    this.stream = stream;
}

// setting
GainController.prototype.setGain = function (val) {
    this.gainFilter.gain.value = val;
    this.gain = val;
};

GainController.prototype.getGain = function () {
    return this.gain;
};

GainController.prototype.off = function () {
    return this.setGain(0);
};

GainController.prototype.on = function () {
    this.setGain(1);
};
