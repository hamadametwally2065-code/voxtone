
/**
 * تحويل AudioBuffer إلى ملف MP3 بجودة عالية.
 * يعتمد على مكتبة lamejs المحملة عالمياً في index.html.
 */
export const audioBufferToMp3 = (buffer: AudioBuffer, bitrate = 320): Blob => {
  // الوصول إلى المكتبة من النطاق العام (window)
  const lib = (window as any).lamejs;
  
  if (!lib) {
    throw new Error("LameJS library is not loaded properly.");
  }

  // حل مشكلة MPEGMode is not defined عبر ربط الثوابت يدوياً بالنطاق العام
  // لضمان وصول الـ Constructor إليها أثناء التنفيذ
  const internalKeys = [
    'MPEGMode', 'Lame', 'Bitstream', 'Presets', 'QuantizePVT', 
    'VbrMode', 'Tables', 'ShortBlock', 'SideInfo', 'Rehash'
  ];

  internalKeys.forEach(key => {
    if (lib[key] !== undefined) {
      (window as any)[key] = lib[key];
    }
  });

  const channels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  
  // إنشاء المشفر باستخدام الكائن المستخرج من المكتبة
  const mp3encoder = new lib.Mp3Encoder(channels, sampleRate, bitrate);
  const mp3Data: Uint8Array[] = [];

  const left = buffer.getChannelData(0);
  const right = channels > 1 ? buffer.getChannelData(1) : null;

  // تحويل البيانات من Float32 إلى Int16 (المطلوب للمشفر)
  const toInt16 = (f32: Float32Array) => {
    const i16 = new Int16Array(f32.length);
    for (let i = 0; i < f32.length; i++) {
      let s = f32[i];
      if (s > 1) s = 1; else if (s < -1) s = -1;
      i16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return i16;
  };

  const leftI16 = toInt16(left);
  const rightI16 = right ? toInt16(right) : null;

  // معالجة البيانات على دفعات (1152 عينة لكل دفعة)
  const blockSize = 1152;
  for (let i = 0; i < leftI16.length; i += blockSize) {
    const leftChunk = leftI16.subarray(i, i + blockSize);
    let chunk: any;
    
    if (rightI16) {
      const rightChunk = rightI16.subarray(i, i + blockSize);
      chunk = mp3encoder.encodeBuffer(leftChunk, rightChunk);
    } else {
      chunk = mp3encoder.encodeBuffer(leftChunk);
    }
    
    if (chunk.length > 0) {
      mp3Data.push(new Uint8Array(chunk));
    }
  }

  const flush = mp3encoder.flush();
  if (flush.length > 0) {
    mp3Data.push(new Uint8Array(flush));
  }

  return new Blob(mp3Data, { type: 'audio/mp3' });
};
