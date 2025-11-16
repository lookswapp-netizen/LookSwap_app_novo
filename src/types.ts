

export interface Option {
  id: string;
  label: string;
  value?: string;
}

export type Step = 'UPLOAD' | 'CUSTOMIZE' | 'RESULT';

// Exported to be used by both client and serverless function
export interface GenerateImageOptions {
    personaId: string;
    hairId: string;
    environmentId: string;
    lightingId: string;
    phoneModeId: string;
    accessoryIds: string[];
    mirrorInteractionId: string;
    postureId: string;
    clothingDescription: string;
    aspectRatioId: string;
}