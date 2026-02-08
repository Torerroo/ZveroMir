-- Добавляем поля для аудита: время обновления и мягкого удаления
ALTER TABLE animals ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE animals ADD COLUMN deleted_at TIMESTAMP NULL;

-- Индексы для производительности
CREATE INDEX idx_animals_updated_at ON animals(updated_at);
CREATE INDEX idx_animals_deleted_at ON animals(deleted_at);