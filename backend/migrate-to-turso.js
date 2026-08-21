// migrate-to-turso.js
//
// Lê o database.sqlite local (via better-sqlite3) e recria cada tabela +
// todos os dados no Turso (via @libsql/client). Roda 100% em Node, sem
// precisar da CLI do Turso — funciona direto no Windows.
//
// Uso: node migrate-to-turso.js
//
// Pré-requisitos:
//   npm install @libsql/client better-sqlite3 dotenv
//   .env com TURSO_DATABASE_URL e TURSO_AUTH_TOKEN preenchidos
 
require('dotenv').config();
const path = require('path');
const Database = require('better-sqlite3');
const { createClient } = require('@libsql/client');
 
// 👉 Ajuste este caminho se o seu database.sqlite não estiver em backend/src/database.sqlite
const LOCAL_DB_PATH = path.join(__dirname, 'src', 'database.sqlite');
 
async function migrate() {
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error('❌ Faltam TURSO_DATABASE_URL / TURSO_AUTH_TOKEN no .env');
    process.exit(1);
  }
 
  console.log(`📂 Abrindo banco local em: ${LOCAL_DB_PATH}`);
  const localDb = new Database(LOCAL_DB_PATH, { readonly: true });
 
  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
  });
 
  // 1. Lista todas as tabelas de verdade do banco (ignora tabelas internas do SQLite)
  const tables = localDb
    .prepare(`SELECT name, sql FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'`)
    .all();
 
  if (tables.length === 0) {
    console.warn('⚠️ Nenhuma tabela encontrada no banco local. Nada a migrar.');
    return;
  }
 
  console.log(`📋 Tabelas encontradas: ${tables.map((t) => t.name).join(', ')}`);
 
  for (const table of tables) {
    console.log(`\n➡️  Migrando tabela "${table.name}"...`);
 
    // 2. Recria a tabela no Turso com o mesmo schema (CREATE TABLE original)
    try {
      await turso.execute(table.sql);
      console.log(`   ✅ Schema criado (ou já existia).`);
    } catch (err) {
      if (String(err).includes('already exists')) {
        console.log('   ℹ️  Tabela já existia no Turso, seguindo para os dados.');
      } else {
        console.error(`   ❌ Erro ao criar schema de "${table.name}":`, err.message);
        continue;
      }
    }
 
    // 3. Copia todos os dados, linha por linha
    const rows = localDb.prepare(`SELECT * FROM "${table.name}"`).all();
 
    if (rows.length === 0) {
      console.log('   (tabela vazia, nada a copiar)');
      continue;
    }
 
    const columns = Object.keys(rows[0]);
    const placeholders = columns.map(() => '?').join(', ');
    const insertSql = `INSERT INTO "${table.name}" (${columns.map((c) => `"${c}"`).join(', ')}) VALUES (${placeholders})`;
 
    let migratedCount = 0;
    for (const row of rows) {
      try {
        await turso.execute({
          sql: insertSql,
          args: columns.map((c) => row[c])
        });
        migratedCount++;
      } catch (err) {
        console.error(`   ⚠️  Erro ao inserir linha:`, row, err.message);
      }
    }
 
    console.log(`   ✅ ${migratedCount}/${rows.length} linhas copiadas.`);
  }
 
  localDb.close();
  console.log('\n🎉 Migração concluída!');
}
 
migrate().catch((err) => {
  console.error('❌ Erro fatal na migração:', err);
  process.exit(1);
});
 