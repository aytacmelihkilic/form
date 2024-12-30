import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft } from 'lucide-react';
import { Form } from '../types/form';

interface Response {
  id: string;
  answers: Record<string, string>;
  created_at: string;
}

export default function FormResponses() {
  const { id } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFormAndResponses();
  }, [id]);

  const fetchFormAndResponses = async () => {
    if (!id) return;

    // Fetch form details
    const { data: formData } = await supabase
      .from('forms')
      .select('*')
      .eq('id', id)
      .single();

    if (formData) {
      setForm(formData);

      // Fetch responses
      const { data: responsesData } = await supabase
        .from('responses')
        .select('*')
        .eq('form_id', id)
        .order('created_at', { ascending: false });

      if (responsesData) {
        setResponses(responsesData);
      }
    }

    setLoading(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;
  }

  if (!form) {
    return <div>Form bulunamadı</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Geri Dön
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{form.title}</h1>
          <p className="text-gray-600">{form.description}</p>
          <p className="text-sm text-gray-500 mt-2">
            Toplam Yanıt: {responses.length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  {form.questions.map((question) => (
                    <th
                      key={question.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {question.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {responses.map((response) => (
                  <tr key={response.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(response.created_at).toLocaleDateString()}
                    </td>
                    {form.questions.map((question) => (
                      <td
                        key={question.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {response.answers[question.id] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}