export interface Question {
  id: string;
  type: 'text' | 'number' | 'choice';
  title: string;
  required: boolean;
  options?: string[];
}

export interface Form {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}