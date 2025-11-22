export enum WizardStep {
  UPLOAD = 'UPLOAD',
  CROP = 'CROP',
  PERSONA = 'PERSONA',
  STYLE = 'STYLE',
  GENERATE = 'GENERATE',
  NAME_PIECE = 'NAME_PIECE',
  SPEECH_CONFIG = 'SPEECH_CONFIG',
  GENERATE_INSTRUCTIONS = 'GENERATE_INSTRUCTIONS',
  FINAL_RESULT = 'FINAL_RESULT',
}

export type AspectRatio = '9:16' | '16:9';

export interface ImageState {
  original: string | null;
  cropped: string | null;
  generated: string | null;
}

export type SceneCategory = 'mirror' | 'selfie' | 'promo' | 'editorial';

export interface SceneData {
  category: SceneCategory;
  options: Record<string, string>;
}

export type PersonaCompatibility = 'full' | 'recalibrated' | 'blocked';

export interface PersonaState {
  skinTone: string;
  hairStyle: string;
  compatibility: PersonaCompatibility;
  autoRecalibrated: boolean;
}

export interface WizardData {
  aspectRatio: AspectRatio;
  pieceName: string;
  speechQuantity: number;
  instructions?: string;
}