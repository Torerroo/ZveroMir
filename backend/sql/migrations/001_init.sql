-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица категорий
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

-- Таблица видов
CREATE TABLE IF NOT EXISTS species (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    UNIQUE(name, category_id)
);

-- Таблица животных (Чистая, без image_url)
CREATE TABLE IF NOT EXISTS animals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    species_id INTEGER NOT NULL,
    breed TEXT,
    age INTEGER,
    gender TEXT CHECK(gender IN ('Мальчик', 'Девочка', 'Неизвестно')),
    size TEXT CHECK(size IN ('Маленький', 'Средний', 'Большой')),
    status TEXT DEFAULT 'Доступно' CHECK(status IN ('Доступно', 'Зарезервировано', 'Пристроено')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (species_id) REFERENCES species(id)
);

CREATE INDEX idx_animals_deleted_at ON animals(deleted_at);