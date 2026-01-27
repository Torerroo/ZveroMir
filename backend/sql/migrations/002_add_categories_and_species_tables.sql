-- Создаём таблицу категорий
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

-- Создаём таблицу видов (привязана к категориям)
CREATE TABLE species (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    UNIQUE(name, category_id)  -- уникальность вида в категории
);

-- Добавляем колонки ссылок в animals
ALTER TABLE animals ADD COLUMN category_id INTEGER;
ALTER TABLE animals ADD COLUMN species_id INTEGER;

-- Заполняем справочник categories уникальными категориями из animals
INSERT INTO categories (name)
SELECT DISTINCT category FROM animals WHERE category IS NOT NULL;

-- Заполняем справочник species уникальными видами, привязанными к категориям
INSERT INTO species (name, category_id)
SELECT DISTINCT a.species, c.id
FROM animals a
JOIN categories c ON a.category = c.name
WHERE a.species IS NOT NULL;

-- Обновляем animals: ставим ссылки на категории и виды
UPDATE animals
SET category_id = (SELECT id FROM categories WHERE name = animals.category),
    species_id = (SELECT id FROM species WHERE name = animals.species AND category_id = (SELECT id FROM categories WHERE name = animals.category));

-- Удаляем старые текстовые колонки (после проверки, что всё обновлено)
ALTER TABLE animals DROP COLUMN category;
ALTER TABLE animals DROP COLUMN species;