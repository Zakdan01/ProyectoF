import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Prueba de conexión detallada y verificación de tablas por esquema
const verifyDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log(`\x1b[32m%s\x1b[0m`, `---------------------------------------------------------`);
    console.log(`\x1b[36m%s\x1b[0m`, `🐘 PostgreSQL: Intentando conectar a "${process.env.DB_NAME}"...`);
    
    // 1. Verificar nombre de la BD y hora actual
    const resTime = await client.query('SELECT current_database(), NOW()');
    console.log(`\x1b[32m%s\x1b[0m`, `✅ Conectado exitosamente a la base de datos: ${resTime.rows[0].current_database}`);

    // 2. Obtener lista de tablas y sus esquemas (excluyendo esquemas de sistema)
    const tablesRes = await client.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog') 
      AND table_type = 'BASE TABLE'
      ORDER BY table_schema, table_name;
    `);

    const tables = tablesRes.rows;
    
    if (tables.length === 0) {
      console.log(`\x1b[31m%s\x1b[0m`, `⚠️ ATENCIÓN: No se encontraron tablas en ningún esquema accesible.`);
      console.log(`\x1b[90m%s\x1b[0m`, `💡 Sugerencia: Verifica que las tablas estén creadas y que el usuario "${process.env.DB_USER}" tenga permisos.`);
    } else {
      console.log(`\x1b[33m%s\x1b[0m`, `📋 Se encontraron ${tables.length} tablas en total. Iniciando corroboración:`);

      // 3. Verificar cada tabla una por una especificando su esquema
      for (const table of tables) {
        const schemaName = table.table_schema;
        const tableName = table.table_name;
        try {
          // Usamos el formato "esquema"."tabla" para asegurar la ruta correcta
          await client.query(`SELECT 1 FROM "${schemaName}"."${tableName}" LIMIT 1`);
          console.log(`   \x1b[32m✔\x1b[0m Tabla [\x1b[36m${schemaName}\x1b[0m].[\x1b[35m${tableName}\x1b[0m]: Corroborada y respondiendo.`);
        } catch (tableErr) {
          console.log(`   \x1b[31m✘\x1b[0m Tabla [\x1b[36m${schemaName}\x1b[0m].[\x1b[35m${tableName}\x1b[0m]: Error de respuesta - ${tableErr.message}`);
        }
      }
    }

    console.log(`\x1b[32m%s\x1b[0m`, `🚀 Sistema de base de datos listo para operar.`);
    console.log(`\x1b[32m%s\x1b[0m`, `---------------------------------------------------------`);
    
    client.release();
  } catch (err) {
    console.error(`\x1b[31m%s\x1b[0m`, `❌ ERROR CRÍTICO AL CONECTAR A LA BASE DE DATOS:`);
    console.error(err.stack);
    console.log(`\x1b[31m%s\x1b[0m`, `---------------------------------------------------------`);
  }
};

verifyDatabase();

export default pool;
