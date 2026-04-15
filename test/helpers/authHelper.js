/**
 * Helper: Autenticação
 * Fornece funções auxiliares para realizar login e gerenciar tokens JWT
 * 
 * NOTA: O endpoint /api/login ainda não está implementado na API.
 * Este helper está pronto para ser utilizado quando a autenticação for implementada.
 */

const users = require("../fixtures/users");

/**
 * Simula o login e retorna um token JWT (para testes locais)
 * 
 * Quando o endpoint /api/login for implementado na API, 
 * descomente o código que faz a requisição real:
 * 
 * @param {object} agent - Instância do Supertest agent
 * @param {string} username - Nome de usuário
 * @param {string} password - Senha
 * @returns {Promise<string>} Token JWT
 */
async function loginUser(agent, username, password) {
  // TODO: Descomente quando /api/login estiver implementado
  /*
  const response = await agent
    .post("/api/login")
    .send({
      username,
      password,
    });

  if (response.status !== 200) {
    throw new Error(`Login failed: ${response.body.message}`);
  }

  return response.body.token;
  */

  // Simulação temporária: gera um token JWT fictício
  return generateMockToken(username);
}

/**
 * Gera um token JWT fictício para testes
 * Será substituído pelo token real quando o endpoint de login estiver pronto
 * 
 * @param {string} username - Nome de usuário
 * @returns {string} Token JWT fictício
 */
function generateMockToken(username) {
  // Token JWT fictício segue o padrão: header.payload.signature
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
    "base64"
  );
  const payload = Buffer.from(
    JSON.stringify({
      sub: username,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // Expira em 1 hora
    })
  ).toString("base64");
  const signature = "mock_signature_token";

  return `${header}.${payload}.${signature}`;
}

/**
 * Obtém um usuário fixture por nome de usuário
 * 
 * @param {string} username - Nome de usuário
 * @returns {object|null} Dados do usuário ou null se não encontrado
 */
function getUserByUsername(username) {
  return users.find((u) => u.username === username) || null;
}

/**
 * Obtém todos os usuários fixture
 * 
 * @returns {array} Array de usuários
 */
function getAllUsers() {
  return users;
}

module.exports = {
  loginUser,
  generateMockToken,
  getUserByUsername,
  getAllUsers,
};
