const AUDIO_WAV = 'audio/wav'
const AUDIO_MPEG = 'audio/mpeg'
const AUDIO_MP3 = 'audio/mp3'
const AUDIO_M4A = 'audio/m4a'
const AUDIO_WEBM = 'audio/webm'
const AUDIO_OGG = 'audio/ogg'

const VIDEO_WEBM = 'video/webm';
const VIDEO_OGV = 'video/ogv';

export const SUPPORTED_MIMES = [
  AUDIO_WAV,
  AUDIO_MPEG,
  AUDIO_MP3,
  AUDIO_M4A,
  AUDIO_WEBM,
  AUDIO_OGG,
  VIDEO_WEBM,
  VIDEO_OGV,
];

export const mimeToExension = mime => {
  switch (mime) {
  case AUDIO_WAV:
    return 'wav';
  case AUDIO_MPEG:
  case AUDIO_MP3:
    return 'mp3';
  case AUDIO_M4A:
    return 'm4a';
  case AUDIO_WEBM:
    return 'weba';
  case VIDEO_WEBM:
    return 'webm';
  case AUDIO_OGG:
    return 'oga';
  case VIDEO_OGV:
    return 'ogv';
  default:
    return null;
  }
};

