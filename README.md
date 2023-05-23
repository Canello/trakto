# Desafio Trakto Back-end

## Como executar o projeto?

1. Instalar as dependências com `npm install` na pasta do projeto.
2. Criar um cluster no MongoDB Atlas (https://www.mongodb.com/atlas/database).
3. Adicionar um arquivo .env na pasta raíz do projeto com as seguintes variáveis:
   ```
   API_ADDRESS=<Endereço do servidor> # Rodando na máquina provavelmente será http://localhost:3000
   MONGODB_ATLAS_CONNECTION_STRING=<String de conexão com o cluster do MongoDB Atlas>
   ```
4. Executar `npm start`
