-- 1. users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'USER',
    avatar_url TEXT
);

-- 2. clothing_items
CREATE TABLE IF NOT EXISTS clothing_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    image_path TEXT NOT NULL,
    category TEXT NOT NULL,
    colour TEXT,
    season TEXT,
    brand TEXT
);

-- 3. outfits
CREATE TABLE IF NOT EXISTS outfits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. outfit_items
DROP TABLE IF EXISTS outfit_items CASCADE;

CREATE TABLE IF NOT EXISTS outfit_items (
    outfit_id UUID NOT NULL,
    clothing_item_id UUID NOT NULL,
    PRIMARY KEY (outfit_id, clothing_item_id),
    FOREIGN KEY (outfit_id) REFERENCES outfits(id) ON DELETE CASCADE,
    FOREIGN KEY (clothing_item_id) REFERENCES clothing_items(id) ON DELETE CASCADE
);


-- 5. outfit_history
CREATE TABLE IF NOT EXISTS outfit_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outfit_id UUID NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
    worn_on DATE NOT NULL
);

-- 6. outfits_suggestions
CREATE TABLE IF NOT EXISTS outfits_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. suggested_outfit
CREATE TABLE IF NOT EXISTS suggested_outfit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ai_suggestion_id UUID NOT NULL REFERENCES outfits_suggestions(id) ON DELETE CASCADE,
    clothing_items_id UUID NOT NULL REFERENCES clothing_items(id) ON DELETE CASCADE,
    type TEXT NOT NULL
);
