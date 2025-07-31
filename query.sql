INSERT INTO users (name, email, status, role, created_at)
SELECT 
  'User ' || x,
  'user' || x || '@example.com',
  CASE 
    WHEN x % 3 = 0 THEN 'active'
    WHEN x % 3 = 1 THEN 'inactive'
    ELSE 'pending'
  END,
  CASE 
    WHEN x % 3 = 0 THEN 'admin'
    WHEN x % 3 = 1 THEN 'user'
    ELSE 'moderator'
  END,
  NOW()
FROM generate_series(1, 300) AS s(x);
