/*
  # Create forms and responses tables

  1. New Tables
    - `form_templates`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `template_data` (jsonb)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)
    
  2. Security
    - Enable RLS on all tables
    - Add policies for CRUD operations
*/

-- Create form templates table
CREATE TABLE IF NOT EXISTS form_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  template_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE form_templates ENABLE ROW LEVEL SECURITY;

-- Policies for form templates
CREATE POLICY "Users can create templates"
  ON form_templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own templates"
  ON form_templates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
  ON form_templates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
  ON form_templates FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);