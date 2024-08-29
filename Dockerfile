# Usar uma imagem base Node.js
FROM node:18-alpine

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar os arquivos package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante dos arquivos do projeto para o contêiner
COPY . .

# Compilar o TypeScript para JavaScript
RUN npm run build

# Expor a porta que a aplicação vai usar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "start"]
