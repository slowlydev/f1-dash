-- cleanup database, we can do this as we only need storage during a race
DELETE FROM updates
WHERE 1 = 1;

-- change to jsonb
ALTER TABLE updates
  ALTER COLUMN state TYPE jsonb
  USING state::jsonb;

