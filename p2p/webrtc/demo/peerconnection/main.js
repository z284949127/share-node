let localPeerConnection;
let servers = {};

let localStream = null;
let remoteStream = null;
let localPeerConnection = null;
let remotePeerConnection = null;

const offerOptions = {
  offerToReceiveVideo: 1,
};
const mediaStreamConstraints = {
  video: true,
  audio: false,
}

// local remote
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startBtn = document.getElementById('startButton');
const callBtn = document.getElementById('callButton');
const hangupButton = document.getElementById('hangupButton');
// 点击开始
startBtn.onclick = function() {
  navigator.mediaDevices.getUserMedia(mediaStreamConstraints).then((mediaStream) => {
    localVideo.srcObject = mediaStream;
    localStream = mediaStream;
    console.log('Receive local stream');
  }).catch((error) => {
    console.error('handle local media stream error');
  });
}
// 点击呼叫
callBtn.onclick = function() {
  const videoTracks = localStream.getVideoTracks();
  const audioTracks = localStream.getAudioTracks();
  localPeerConnection = new RTCPeerConnection(servers);

  localPeerConnection.addEventListener('icecandidate', handleConnection);
  localPeerConnection.addEventListener('iceconnectionstatechange', () => {

  });

}

// ice可用
function handleConnection(event) {
  const peerConnection = event.target;
  const iceCandidate = event.candidate;
  if (iceCandidate) {
    const newIceCandidate = new RTCIceCandidate(iceCandidate);
    const otherPeer = getOtherPeer(peerConnection);
    otherPeer.addIceCandidate(newIceCandidate).then((peerConnection) => {
      // connection 成功
      console.log(peerConnection, ' addIceCandidate success');
    }).catch((error) => {
      console.error('error');
    });
    console.log();
  }
}

function getPeerName(peerConnection) {
  return (peerConnection === localPeerConnection) ?
      'localPeerConnection' : 'remotePeerConnection';
}
