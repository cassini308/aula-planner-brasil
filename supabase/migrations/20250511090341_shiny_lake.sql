/*
  # Add initial admin user and fix site configurations

  1. Changes
    - Add initial admin user with email admin@escola.com and password admin123
    - Fix site configurations to properly update site name and logo
*/

-- Function to create initial admin user if it doesn't exist
DO $$
BEGIN
  -- Check if the admin user already exists
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'admin@escola.com'
  ) THEN
    -- Insert the admin user
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      '57692d14-117f-4def-b660-0a226859d8ba',
      'authenticated',
      'authenticated',
      'admin@escola.com',
      crypt('admin123', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"],"role":"admin"}',
      '{"role":"admin"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;

-- Update the configuracoes_site table to properly handle updates
CREATE OR REPLACE FUNCTION handle_site_config_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the site name in all places where it's used
  UPDATE configuracoes_site
  SET nomeescola = NEW.nomeescola,
      logourl = NEW.logourl;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'site_config_update_trigger'
  ) THEN
    CREATE TRIGGER site_config_update_trigger
    AFTER UPDATE ON configuracoes_site
    FOR EACH ROW
    EXECUTE FUNCTION handle_site_config_update();
  END IF;
END $$;