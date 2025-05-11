export const DEFAULT_EFFECTS: AudioEffects = {
  volume: 1,
  pitch: 1,
  speed: 1,
  reversed: false,
  echo: {
    enabled: false,
    delay: 0.3,
    feedback: 0.5
  },
};

export function reverseAudioBuffer(
  audioContext: AudioContext | OfflineAudioContext, 
  buffer: AudioBuffer
): AudioBuffer {
  const clone = audioContext.createBuffer(
    buffer.numberOfChannels, 
    buffer.length, 
    buffer.sampleRate
  );
  
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    clone.getChannelData(i).set(buffer.getChannelData(i).slice().reverse());
  }
  
  return clone;
}

export function bufferToWave(abuffer: AudioBuffer): Blob {
  const numOfChan = abuffer.numberOfChannels;
  const length = abuffer.length * numOfChan * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);
  const channels: Float32Array[] = [];
  const sampleRate = abuffer.sampleRate;

  let offset = 0;
  let pos = 0;

  const setUint16 = (data: number) => {
    view.setUint16(pos, data, true);
    pos += 2;
  };

  const setUint32 = (data: number) => {
    view.setUint32(pos, data, true);
    pos += 4;
  };

  setUint32(0x46464952);                  // "RIFF"
  setUint32(length - 8);                  // Taille du fichier - 8
  setUint32(0x45564157);                  // "WAVE"
  setUint32(0x20746d66);                  // "fmt "
  setUint32(16);                          // Taille du bloc format
  setUint16(1);                           // Format audio (1 = PCM)
  setUint16(numOfChan);                   // Nombre de canaux
  setUint32(sampleRate);                  // Fréquence d'échantillonnage
  setUint32(sampleRate * numOfChan * 2);  // Débit binaire
  setUint16(numOfChan * 2);               // Bloc d'alignement
  setUint16(16);                          // Bits par échantillon

  setUint32(0x61746164);                  // "data"
  setUint32(length - pos - 4);            // Taille des données

  for (let i = 0; i < abuffer.numberOfChannels; i++) {
    channels.push(abuffer.getChannelData(i));
  }

  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) {
      const sample = Math.max(-1, Math.min(1, channels[i][offset]));
      view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([buffer], { type: "audio/wav" });
}

export async function processAudioWithEffects(
  audioBuffer: AudioBuffer,
  effects: AudioEffects
): Promise<AudioBuffer> {
  const finalDuration = effects.echo.enabled 
    ? audioBuffer.length + (audioBuffer.sampleRate * effects.echo.delay * 5)
    : audioBuffer.length;
  
  const offlineCtx = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    finalDuration,
    audioBuffer.sampleRate
  );
  
  const source = offlineCtx.createBufferSource();
  const gainNode = offlineCtx.createGain();
  
  const processedBuffer = effects.reversed 
    ? reverseAudioBuffer(offlineCtx, audioBuffer) 
    : audioBuffer;
  
  source.buffer = processedBuffer;
  source.playbackRate.value = effects.speed;
  gainNode.gain.value = effects.volume;
  
  const lastNode: AudioNode = source;
  
  if (effects.echo.enabled) {
    const delay = offlineCtx.createDelay(2.0);
    delay.delayTime.value = effects.echo.delay;
    
    const feedback = offlineCtx.createGain();
    feedback.gain.value = effects.echo.feedback;
    
    lastNode.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    
    lastNode.connect(gainNode);
    delay.connect(gainNode);
  } else {
    lastNode.connect(gainNode);
  }
  
  gainNode.connect(offlineCtx.destination);
  
  source.start(0);
  
  return offlineCtx.startRendering();
}