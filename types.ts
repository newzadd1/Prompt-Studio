export enum Mode {
  Image = "ภาพนิ่ง",
  Video = "วิดีโอ",
  Story = "เนื้อเรื่อง",
}

export interface StylePreset {
  name: string;
  prompt: string;
}

export interface Scene {
  description: string;
  action: string;
  mood: string;
  cta: string;
  cameraAngle: string;
}

export interface Project {
  id: string;
  name: string;
  mode: Mode;
  stylePreset: StylePreset;
  characterSceneCap: string;
  isNsfw: boolean;
  scenes: Scene[];
  generatedPrompt?: string;
}