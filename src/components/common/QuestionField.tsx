import React from 'react';
import { Question } from '../../types/form';
import { Plus, Minus } from 'lucide-react';

interface QuestionFieldProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  onRemove?: () => void;
}

export default function QuestionField({ question, onUpdate, onRemove }: QuestionFieldProps) {
  const addOption = () => {
    const currentOptions = question.options || [];
    onUpdate({ options: [...currentOptions, ''] });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(question.options || [])];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = [...(question.options || [])];
    newOptions.splice(index, 1);
    onUpdate({ options: newOptions });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <input
            type="text"
            value={question.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Soru"
            className="w-full border-none focus:outline-none focus:ring-0 font-medium"
            required
          />
          <div className="mt-2 space-y-2">
            <select
              value={question.type}
              onChange={(e) => onUpdate({ type: e.target.value as Question['type'] })}
              className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="text">Metin</option>
              <option value="number">Sayı</option>
              <option value="choice">Çoktan Seçmeli</option>
            </select>

            {question.type === 'choice' && (
              <div className="mt-4 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Seçenekler</label>
                {(question.options || []).map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Seçenek ${index + 1}`}
                      className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Seçenek Ekle
                </button>
              </div>
            )}

            <div className="mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={question.required}
                  onChange={(e) => onUpdate({ required: e.target.checked })}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Zorunlu</span>
              </label>
            </div>
          </div>
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700"
          >
            Sil
          </button>
        )}
      </div>
    </div>
  );
}