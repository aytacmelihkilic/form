/*
  # Enable public form access

  1. Changes
    - Add policy for public form viewing
    - Add policy for public response submission
  
  2. Security
    - Forms can be viewed by anyone (but only basic form data, not responses)
    - Responses can be submitted by anyone
*/

-- Allow public access to forms (read-only)
CREATE POLICY "Forms are publicly viewable"
  ON forms FOR SELECT
  TO anon
  USING (true);

-- Allow public response submission
CREATE POLICY "Anyone can submit responses"
  ON responses FOR INSERT
  TO anon
  WITH CHECK (true);