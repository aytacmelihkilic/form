import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, LogOut, Pencil, Trash2, Share2, Copy, FileText, FormInput } from 'lucide-react';

interface Form {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

export default function Dashboard() {
  const [forms, setForms] = useState<Form[]>([]);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setForms(data);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('forms').delete().eq('id', id);
    if (!error) {
      setForms(forms.filter(form => form.id !== id));
    }
  };

  const copyShareLink = async (formId: string) => {
    // Tam URL'yi oluştur
    const shareUrl = `${window.location.origin}/f/${formId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(formId);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Form Builder</h1>
            <button
              onClick={handleSignOut}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Forms</h2>
          <Link
            to="/forms/new"
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create New Form
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{form.title}</h3>
              <p className="text-gray-600 mb-4">{form.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(form.created_at).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <Link
                    to={`/f/${form.id}`}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-md relative group"
                    title="Fill Form"
                  >
                    <FormInput className="w-5 h-5" />
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Fill Form
                    </span>
                  </Link>
                  <button
                    onClick={() => copyShareLink(form.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md relative group"
                    title="Share Form"
                  >
                    {copySuccess === form.id ? (
                      <Copy className="w-5 h-5" />
                    ) : (
                      <Share2 className="w-5 h-5" />
                    )}
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {copySuccess === form.id ? 'Copied!' : 'Copy share link'}
                    </span>
                  </button>
                  <Link
                    to={`/forms/${form.id}/responses`}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-md relative group"
                    title="View Responses"
                  >
                    <FileText className="w-5 h-5" />
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Responses
                    </span>
                  </Link>
                  <Link
                    to={`/forms/${form.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    <Pencil className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(form.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}