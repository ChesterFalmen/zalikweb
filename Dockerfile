# Використовуємо офіційний образ Node.js
FROM node:14

# Встановлюємо робочий каталог в контейнері
WORKDIR /app

# Копіюємо файли package.json та package-lock.json та виконуємо npm install
COPY package*.json ./
RUN npm install

# Копіюємо всі інші файли у контейнер
COPY . .

# Вказуємо порт, на якому працює додаток
EXPOSE 3000

# Команда, яка буде виконуватися при запуску контейнера
CMD ["npm", "start"]