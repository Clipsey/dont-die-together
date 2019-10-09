// import axios from 'axios';

const AudioAbstractions = {
  audioFiles: {
    pistol: 'pistol.mp3',
    rifle: 'rifle.mp3',
    shotgun: 'shotgun.mp3',
    playerDeath: 'playerDeath.mp3',
    lowHealth: 'lowHealth.mp3',
    fleshEating: 'fleshEating.mp3',
    fleshEating2: 'fleshEating2.mp3',
    creepyScream: 'creepyScream.mp3',
    thunk: 'thunk.mp3',
    heartbeat: 'heartbeat.mp3'
  },
  audioBuffers: {},
  heartbeat: null
}
const audioContext = new AudioContext();
const heartbeatContext = new AudioContext();

export const audioSetup = async () => {
  for (let key in AudioAbstractions.audioFiles) {
    let audioFile = AudioAbstractions.audioFiles[key];

    fetch(`/api/audio/${audioFile}`)
      .then((response) => response.arrayBuffer())
      .then(buffer => {
        audioContext.decodeAudioData(buffer, decoded => {
          AudioAbstractions.audioBuffers[key] = decoded;
        })
      })
  }
}

export const playSound = (selector) => {
  let audioBufferSourceNode = audioContext.createBufferSource();
  audioBufferSourceNode.buffer = AudioAbstractions.audioBuffers[selector];
  audioBufferSourceNode.connect(audioContext.destination);
  audioBufferSourceNode.start();
}

// export const stopSound = (selector) => {
//   let audioBufferSourceNode = audioContext.createBufferSource();
//   audioBufferSourceNode.buffer = AudioAbstractions.audioBuffers[selector];
//   audioBufferSourceNode.connect(audioContext.destination);
//   audioBufferSourceNode.stop();
// }

export const playHeartBeat = (multiplier) => {
  const gainNode = heartbeatContext.createGain();
  console.log('playing Heartbeat');
  gainNode.gain.value = 3.0//1.0 * multiplier > 1.0 ? 1.0 * multiplier > 1.0 : 1.0;
  if (AudioAbstractions.heartbeat) {
    let oldAudioBufferSourceNode = AudioAbstractions.heartbeat;
    oldAudioBufferSourceNode.stop();
    let newAudioBufferSourceNode = heartbeatContext.createBufferSource();
    newAudioBufferSourceNode.buffer = AudioAbstractions.audioBuffers['heartbeat'];
    newAudioBufferSourceNode.playbackRate.value = multiplier;
    newAudioBufferSourceNode.loop = true;
    newAudioBufferSourceNode.connect(gainNode);
    gainNode.connect(heartbeatContext.destination);
    // gainNode.start();
    newAudioBufferSourceNode.start();
    AudioAbstractions.heartbeat = newAudioBufferSourceNode;
  } else {
    let audioBufferSourceNode = heartbeatContext.createBufferSource();
    audioBufferSourceNode.buffer = AudioAbstractions.audioBuffers['heartbeat'];
    audioBufferSourceNode.playbackRate.value = multiplier;
    audioBufferSourceNode.loop = true;
    audioBufferSourceNode.connect(gainNode);
    gainNode.connect(heartbeatContext.destination);
    audioBufferSourceNode.start();
    // gainNode.start();
    AudioAbstractions.heartbeat = audioBufferSourceNode;
  }
}


// axios.get(`/api/audio/pistol.mp3`, {
    //   responseType: 'arraybuffer',
    //   method: 'get',
    //   headers: {
    //     'Content-Type': 'audio/mpeg'
    //   }
    // }).then( data => {
    //   console.log(data);
    //   const audioContext = new AudioContext();
    //   let audioBufferSourceNode = audioContext.createBufferSource();

    //   audioContext.decodeAudioData(data.data, decoded => {
    //     window.addEventListener('click', (e) => {
    //       console.log(e);
    //       audioBufferSourceNode.buffer = decoded;
    //       // audioBufferSourceNode.loop = true;
    //       audioBufferSourceNode.connect(audioContext.destination);
    //       audioBufferSourceNode.start();
    //     })
    //   })
    // })