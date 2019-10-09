// import axios from 'axios';

const AudioAbstractions = {
  audioFiles: {
    pistol: 'pistol.mp3'
  },
  audioBuffers: {}
}
const audioContext = new AudioContext();

export const audioSetup = async () => {
  for (let key in AudioAbstractions.audioFiles) {
    let audioFile = AudioAbstractions.audioFiles[key];

    fetch(`/api/audio/${audioFile}`)
      .then((response) => response.arrayBuffer())
      .then(buffer => {
        audioContext.decodeAudioData(buffer, decoded => {
          AudioAbstractions.audioBuffers[key] = decoded;
          // window.addEventListener('click', (e) => {
          //   console.log(e);
          //   let audioBufferSourceNode = audioContext.createBufferSource();
          //   audioBufferSourceNode.buffer = decoded;
          //   audioBufferSourceNode.connect(audioContext.destination);
          //   audioBufferSourceNode.start();
          // })
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