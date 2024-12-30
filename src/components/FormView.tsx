import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Form } from '../types/form';
import { Send } from 'lucide-react';

export default function FormView() {
  const { id } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      setForm(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    const { error } = await supabase
      .from('responses')
      .insert({
        form_id: form.id,
        answers
      });

    if (!error) {
      setSubmitted(true);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Form Bulunamadı</h1>
          <p className="text-gray-600">Bu form artık mevcut değil veya erişim izniniz yok.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Teşekkürler!</h1>
          <p className="text-gray-600">Yanıtlarınız başarıyla kaydedildi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{form.title}</h1>
            <p className="text-gray-600">{form.description}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {form.questions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
              <label className="block text-gray-800 font-medium mb-2">
                {question.title}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {question.type === 'text' && (
                <input
                  type="text"
                  value={answers[question.id] || ''}
                  required={question.required}
                  onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              {question.type === 'number' && (
                <input
                  type="number"
                  value={answers[question.id] || ''}
                  required={question.required}
                  onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              {question.type === 'choice' && question.options && (
                <select
                  value={answers[question.id] || ''}
                  required={question.required}
                  onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seçiniz...</option>
                  {question.options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Gönder
          </button>
        </form>
      </div>
    </div>
  );
}