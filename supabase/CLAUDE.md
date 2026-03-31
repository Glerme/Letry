# supabase/

## schema.sql
Database schema for the `signs` table. Run in Supabase Dashboard > SQL Editor.

### Table: signs
| Column     | Type         | Notes                              |
|------------|--------------|------------------------------------|
| id         | UUID         | Primary key, auto-generated        |
| slug       | VARCHAR(12)  | Unique, URL-safe, 7 chars via nanoid |
| text       | VARCHAR(200) | Sign text content                  |
| animation  | VARCHAR(20)  | scroll | split-flap | fade           |
| led_color  | VARCHAR(7)   | Hex color e.g. #ff6600             |
| bg_color   | VARCHAR(7)   | Hex color e.g. #111111             |
| speed      | VARCHAR(10)  | slow | normal | fast               |
| user_id    | UUID         | Nullable — anonymous signs allowed |
| created_at | TIMESTAMPTZ  | Auto-set on insert                 |

### RLS Policies
- SELECT: public (anyone can view any sign)
- INSERT: authenticated uid = user_id, OR user_id IS NULL (anonymous)
- UPDATE/DELETE: only the owning user

### Anonymous signs
Signs with user_id = NULL are anonymous and persist indefinitely.
