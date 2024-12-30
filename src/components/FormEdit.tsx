import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Save, ArrowLeft } from 'lucide-react';
import { Form, Question } from '../types/form';
import QuestionField from './common/QuestionField';

export default function FormEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState<Form | null>(null);
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

    if (error) {
      navigate('/');
    } else if (data) {
      setForm(data);
    }
    setLoading(false);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    if (!form) return;

    const updatedQuestions = form.questions.map(q =>
      q.id === questionId ? { ...q, ...updates } : q
    );

    setForm({ ...form, questions: updatedQuestions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !user) return;

    const { error } = await supabase
      .from('forms')
      .update({
        title: form.title,
        description: form.description,
        questions: form.questions
      })
      .eq('id', form.id);

    if (!error) {
      navigate('/');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;
  }

  if (!form) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Geri Dön
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Form Başlığı"
              className="text-2xl font-bold w-full border-none focus:outline-none focus:ring-0"
              required
            />
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Form Açıklaması"
              className="mt-2 w-full border-none focus:outline-none focus:ring-0 text-gray-600"
            />
          </div>

          {form.questions.map((question) => (
            <QuestionField
              key={question.id}
              question={question}
              onUpdate={(updates) => updateQuestion(question.id, updates)}
            />
          ))}

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              <Save className="w-5 h-5 mr-2" />
              Değişiklikleri Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}