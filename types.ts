export interface ImageAsset {
  file: File;
  previewUrl: string;
  base64?: string;
  mimeType?: string;
}

export enum SlotType {
  PERSON = 'PERSON',
  CLOTHING = 'CLOTHING',
  RESULT = 'RESULT'
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  resultUrl: string | null;
}