/*
  # Initial Schema Setup for Form Builder

  1. New Tables
    - `forms`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `questions` (jsonb)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)
    - `responses`
      - `id` (uuid, primary key)
      - `form_id` (uuid, foreign key)
      - `answers` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for form access and management
*/

-- Create forms table
CREATE TABLE forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create responses table
CREATE TABLE responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid REFERENCES forms(id) ON DELETE CASCADE,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Policies for forms
CREATE POLICY "Users can create forms"
  ON forms FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own forms"
  ON forms FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own forms"
  ON forms FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forms"
  ON forms FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for responses
CREATE POLICY "Anyone can submit responses"
  ON responses FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Form owners can view responses"
  ON responses FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM forms
    WHERE forms.id = responses.form_id
    AND forms.user_id = auth.uid()
  ));