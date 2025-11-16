export interface Option {
  id: string;
  label: string;
  value?: string;
}

export type Step = 'UPLOAD' | 'CUSTOMIZE' | 'RESULT';