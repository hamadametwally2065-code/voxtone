
export interface Voice {
  id: string;
  prebuiltId: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  longDescriptionAr: string;
  longDescriptionEn: string;
  gender: 'male' | 'female';
  traits: string[];
  category: 'folk' | 'kids' | 'elders' | 'standard' | 'urban' | 'english' | 'saidi' | 'gulf' | 'levantine' | 'egyptian' | 'other';
  avatarColor: string;
}

export interface Dialect {
  id: string;
  label: string;
  description: string;
}

export interface DialogueSegment {
  id: string;
  speakerIndex: 0 | 1;
  text: string;
}

export type AppMode = 'single' | 'dialogue';
