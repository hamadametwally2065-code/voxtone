
import { Voice, Dialect } from './types';

export const VOICES: Voice[] = [
  // --- STANDARD ARABIC (فصحى) ---
  { 
    id: 'amin_fusha_news', prebuiltId: 'Charon', nameAr: 'أمين (إخباري)', nameEn: 'Amin (News)',
    descriptionAr: 'صوت إخباري فصيح وقوي', descriptionEn: 'Powerful eloquent news voice',
    longDescriptionAr: 'يتميز أمين بنبرة جهورية ومخارج حروف دقيقة جداً. هذا الصوت مصمم للتقارير الإخبارية، التعليق الوثائقي الجاد، والبيانات الرسمية التي تتطلب هيبة وثقة عالية.', 
    longDescriptionEn: 'Amin features a resonant tone and highly precise articulation. This voice is designed for news reporting, serious documentary narration, and official announcements requiring prestige and authority.',
    gender: 'male', traits: ['فصيح', 'قوي', 'رسمي'], category: 'standard', avatarColor: '#1e40af'
  },
  { 
    id: 'yasmin_fusha_academic', prebuiltId: 'Kore', nameAr: 'ياسمين (أكاديمية)', nameEn: 'Yasmin (Academic)',
    descriptionAr: 'صوت تعليمي رصين', descriptionEn: 'Staid educational voice',
    longDescriptionAr: 'ياسمين تقدم أداءً تعليمياً هادئاً ومريحاً للأذن. مثالية للدورات التدريبية، الكتب الصوتية، والمحتوى الأكاديمي الذي يتطلب تركيزاً طويلاً من المستمع.', 
    longDescriptionEn: 'Yasmin delivers a calm and ear-friendly educational performance. Ideal for training courses, audiobooks, and academic content requiring sustained listener focus.',
    gender: 'female', traits: ['هادئة', 'تعليمية', 'دقيقة'], category: 'standard', avatarColor: '#059669'
  },

  // --- ENGLISH & GLOBAL (New Characters Added Here) ---
  { 
    id: 'sky_en_slang', prebuiltId: 'Zephyr', nameAr: 'سكاي (Slang)', nameEn: 'Sky (Slang)',
    descriptionAr: 'صوت شبابي متمرد (Gen-Z)', descriptionEn: 'Edgy Gen-Z slang voice',
    longDescriptionAr: 'سكاي هي الصوت المثالي للمحتوى الشبابي والتريندات. نبرة سريعة، مليئة بالحيوية وتستخدم مصطلحات الـ Slang الأمريكية الحديثة بشكل طبيعي وجذاب.', 
    longDescriptionEn: 'Sky is the perfect voice for youth content and trends. Fast-paced, high-energy, and uses modern American slang naturally and engagingly.',
    gender: 'female', traits: ['Slang', 'Gen-Z', 'Vibrant'], category: 'english', avatarColor: '#f59e0b'
  },
  { 
    id: 'jax_en_slang', prebuiltId: 'Puck', nameAr: 'جاكس (Street)', nameEn: 'Jax (Street Slang)',
    descriptionAr: 'صوت حضري بلهجة الشارع', descriptionEn: 'Cool urban street voice',
    longDescriptionAr: 'جاكس يمثل صوت الشارع الأمريكي (Urban)؛ نبرة منخفضة، ريلاكس، ومثالية لمحتوى الهيب هوب، الجيم، أو المحادثات الودية غير الرسمية.', 
    longDescriptionEn: 'Jax represents the American urban street voice; low-toned, relaxed, and perfect for hip-hop content, gym motivation, or informal friendly chats.',
    gender: 'male', traits: ['Urban', 'Cool', 'Edgy'], category: 'english', avatarColor: '#6366f1'
  },
  { 
    id: 'emma_en_casual', prebuiltId: 'Kore', nameAr: 'إيما (Warm)', nameEn: 'Emma (Warm Casual)',
    descriptionAr: 'صوت يومي دافئ ومريح', descriptionEn: 'Warm everyday casual voice',
    longDescriptionAr: 'إيما هي "صوت الجارة الودودة". نبرة هادئة ومرحبة، مثالية لقصص الحياة اليومية، تطبيقات التأمل، أو الإعلانات التي تخاطب العاطفة والراحة.', 
    longDescriptionEn: 'Emma is the "friendly neighbor" voice. A calm and welcoming tone, ideal for daily life stories, meditation apps, or ads targeting emotion and comfort.',
    gender: 'female', traits: ['Warm', 'Soft', 'Friendly'], category: 'english', avatarColor: '#ec4899'
  },
  { 
    id: 'leo_en_casual', prebuiltId: 'Puck', nameAr: 'ليو (Modern)', nameEn: 'Leo (Modern Casual)',
    descriptionAr: 'صوت عصري، واثق ومرح', descriptionEn: 'Modern, confident & fun',
    longDescriptionAr: 'ليو يقدم أداءً إنجليزياً بلهجة "الساحل الغربي"؛ شخصية منطلقة، محبة للسفر والمغامرة، نبرته توحي بالثقة والمرح في آن واحد.', 
    longDescriptionEn: 'Leo delivers an English performance with a "West Coast" vibe; adventurous, outgoing, and energetic. His tone suggests both confidence and fun.',
    gender: 'male', traits: ['Modern', 'Energetic', 'Traveler'], category: 'english', avatarColor: '#10b981'
  },
  { 
    id: 'lara_en_casual', prebuiltId: 'Zephyr', nameAr: 'لارا (EN)', nameEn: 'Lara (Casual EN)',
    descriptionAr: 'صوت إنجليزي يومي طبيعي', descriptionEn: 'Natural everyday English voice',
    longDescriptionAr: 'لارا تقدم أداءً إنجليزياً بلهجة أمريكية كاجوال، مثالي للبودكاست، التعليق الصوتي لليوتيوب، والمحتوى اليومي.', 
    longDescriptionEn: 'Lara provides a natural American casual English performance, perfect for podcasts, YouTube VO, and daily content.',
    gender: 'female', traits: ['Casual', 'Modern', 'Natural'], category: 'english', avatarColor: '#a855f7'
  },
  { 
    id: 'yasin_en_pro', prebuiltId: 'Puck', nameAr: 'ياسين (EN Pro)', nameEn: 'Yasin (Pro EN)',
    descriptionAr: 'صوت إنجليزي واثق ومحترف', descriptionEn: 'Confident professional English',
    longDescriptionAr: 'ياسين هو الصوت المثالي للعروض التقديمية والدروس باللغة الإنجليزية. نبرة شبابية محترفة توحي بالذكاء والثقة.', 
    longDescriptionEn: 'Yasin is the ideal voice for English presentations and tutorials. A professional youthful tone suggesting intelligence and confidence.',
    gender: 'male', traits: ['Professional', 'Smart', 'Clear'], category: 'english', avatarColor: '#2563eb'
  },

  // --- EGYPTIAN ACTORS & STREET (الممثلين والحارة) ---
  { 
    id: 'salma_actress_egy', prebuiltId: 'Zephyr', nameAr: 'سلمى (نجمة الشاشة)', nameEn: 'Salma (The Star)',
    descriptionAr: 'ممثلة مصرية تجيد كل الأدوار', descriptionEn: 'Versatile Egyptian actress',
    longDescriptionAr: 'سلمى هي "الحرباء الصوتية"؛ تمتلك قدرة فائقة على تقمص الشخصيات. يمكنها أداء دور "بنت الأكابر" برقي، أو "بنت الحارة" بجدعنة.', 
    longDescriptionEn: 'Salma is a "voice chameleon"; she has a supreme ability to embody characters. She can play the "Elite Lady" with sophistication, or the "Street Girl" with grit.',
    gender: 'female', traits: ['ممثلة', 'متلونة', 'درامية'], category: 'egyptian', avatarColor: '#f43f5e'
  },
  { 
    id: 'ahmed_actor_egy', prebuiltId: 'Puck', nameAr: 'أحمد (بطل الدراما)', nameEn: 'Ahmed (The Hero)',
    descriptionAr: 'ممثل مصري بارع وشامل', descriptionEn: 'Comprehensive Egyptian actor',
    longDescriptionAr: 'أحمد يمتلك خامة صوتية سينمائية. يجيد أداء أدوار البطولة، الكوميديا، والدراما الثقيلة. صوته مرن جداً بين لهجات الشارع المصري.', 
    longDescriptionEn: 'Ahmed possesses a cinematic vocal quality. He excels in leading roles, comedy, and heavy drama. His voice is very flexible across Egyptian dialects.',
    gender: 'male', traits: ['بطل', 'سينمائي', 'شامل'], category: 'egyptian', avatarColor: '#0ea5e9'
  },

  // --- GULF (خليجي) ---
  { 
    id: 'nayef_gulf', prebuiltId: 'Charon', nameAr: 'نايف', nameEn: 'Nayef',
    descriptionAr: 'صوت خليجي فخم ووقور', descriptionEn: 'Luxurious Gulf voice',
    longDescriptionAr: 'صوت نايف يجسد الشخصية الخليجية القيادية بوقارها ورصانتها. خيار ممتاز للإعلانات العقارية الفاخرة، والخطابات المؤسسية الكبرى.', 
    longDescriptionEn: 'Nayef\'s voice embodies the leading Gulf personality with dignity and sobriety. An excellent choice for luxury real estate ads and corporate speeches.',
    gender: 'male', traits: ['فخم', 'وقور', 'قيادي'], category: 'gulf', avatarColor: '#1e3a8a'
  },

  // --- LEVANTINE (شامي) ---
  { 
    id: 'bassam_shami', prebuiltId: 'Charon', nameAr: 'بسام', nameEn: 'Bassam',
    descriptionAr: 'رجل شامي تقليدي', descriptionEn: 'Traditional Levantine man',
    longDescriptionAr: 'بسام يمتلك نبرة "قبضاي" الحارة الشامية، بصوت غليظ يوحي بالشهامة والأصالة. رائع للأعمال الدرامية والحكايات الشعبية.', 
    longDescriptionEn: 'Bassam possesses the "Qabdai" tone of the Levantine neighborhood, with a thick voice suggesting chivalry and authenticity.',
    gender: 'male', traits: ['قوي', 'شهم', 'أصيل'], category: 'levantine', avatarColor: '#7c2d12'
  },

  // --- SAIDI (صعيدي) ---
  { 
    id: 'abu_hashim_saidi', prebuiltId: 'Charon', nameAr: 'أبو هاشم (العمدة)', nameEn: 'Abu Hashim (The Mayor)',
    descriptionAr: 'صوت عمدة صعيدي وقور', descriptionEn: 'Dignified Saidi Mayor',
    longDescriptionAr: 'أبو هاشم يمثل صوت الحكمة والرزانة في صعيد مصر. نبرة عمدة يزن الكلمات، مناسبة للأعمال التاريخية والدراما الصعيدية.', 
    longDescriptionEn: 'Abu Hashim represents the voice of wisdom and sobriety in Upper Egypt. The tone of a mayor who weighs his words, suitable for historical works.',
    gender: 'male', traits: ['عمدة', 'وقور', 'هيبة'], category: 'saidi', avatarColor: '#1e3a8a'
  }
];

export const DIALECTS: Dialect[] = [
  { id: 'standard', label: 'العربية الفصحى', description: 'Standard Arabic' },
  { id: 'egyptian', label: 'اللهجة المصرية', description: 'Egyptian Street' },
  { id: 'english_casual', label: 'English Casual', description: 'Natural everyday English' },
  { id: 'gulf', label: 'اللهجة الخليجية', description: 'Gulf Arabic' },
  { id: 'levantine', label: 'اللهجة الشامية', description: 'Levantine Arabic' },
  { id: 'saidi', label: 'اللهجة الصعيدية', description: 'Upper Egyptian' },
  { id: 'english_slang', label: 'English Slang', description: 'Urban Slang' }
];

export const TRANSLATIONS = {
  ar: {
    app_name: 'VoxTone',
    toggle_lang: 'English',
    single: 'صوت منفرد',
    dialogue: 'حوار',
    input_instruction: 'أدخل النص:',
    dialogue_instruction: 'أدخل نصوص الحوار:',
    editor_placeholder: 'اكتب شيئاً هنا.. مثال: [ضحك] أهلاً بك!',
    add_line: '+ سطر جديد',
    dialect_title: 'اللهجة',
    voice_title: 'الشخصية',
    speaker_a: 'المتحدث (أ)',
    speaker_b: 'المتحدث (ب)',
    generate_btn: 'توليد الصوت',
    generating_msg: 'جاري المعالجة...',
    success_msg: 'تم!',
    error_msg: 'خطأ في التوليد.',
    ai_disclosure: 'VoxTone: أداء ذكي فائق السرعة.',
    privacy_note: 'خصوصيتك محمية.',
    more_info: 'التفاصيل'
  },
  en: {
    app_name: 'VoxTone',
    toggle_lang: 'العربية',
    single: 'Single',
    dialogue: 'Dialogue',
    input_instruction: 'Enter text:',
    dialogue_instruction: 'Enter dialogue lines:',
    editor_placeholder: 'Write here.. e.g: [laughing] Welcome!',
    add_line: '+ Add Line',
    dialect_title: 'Dialect',
    voice_title: 'Persona',
    speaker_a: 'Speaker A',
    speaker_b: 'Speaker B',
    generate_btn: 'Generate Voice',
    generating_msg: 'Processing...',
    success_msg: 'Success!',
    error_msg: 'Generation failed.',
    ai_disclosure: 'VoxTone: High-speed intelligent performance.',
    privacy_note: 'Your privacy is safe.',
    more_info: 'More info'
  }
};
