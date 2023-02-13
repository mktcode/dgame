export function playAudio(key: string, volume: number = 1, loop: boolean = false) {
  const audio = new Audio(`/sounds/${key}.mp3`);
  audio.volume = volume;
  audio.loop = loop;
  audio.play();

  return audio;
}
