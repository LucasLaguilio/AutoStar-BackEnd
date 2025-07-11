import mysql, {
  Connection,
  ConnectionOptions,
  QueryError,
} from "mysql2/promise";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors";

const app = fastify();

app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
});

app.addHook("onRequest", (request, reply, done) => {
  console.log(`[REQUEST] Method: ${request.method}, URL: ${request.url}`);
  done();
});

app.get("/", (request: FastifyRequest, reply: FastifyReply) => {
  reply.send("Fastify Funcionando!");
});

app.get("/Carros", async (request: FastifyRequest, reply: FastifyReply) => {
  let conn: Connection | undefined;
  try {
    conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "AutoStar",
      port: 3306,
    });
    const [dados, estruturaTabela] = await conn.query("SELECT * FROM Carros");
    reply.status(200).send(dados);
  } catch (erro: any) {
    console.error("ERRO ao obter Carros:", erro);
    if (erro.code === "ECONNREFUSED") {
      reply.status(500).send({ mensagem: "ERRO: O servidor do banco de dados (Laragon) não está ligado ou acessível." });
    } else if (erro.code === "ER_BAD_DB_ERROR") {
      reply.status(500).send({ mensagem: "ERRO: O nome do banco de dados está incorreto ou o banco de dados não existe." });
    } else if (erro.code === "ER_ACCESS_DENIED_ERROR") {
      reply.status(401).send({ mensagem: "ERRO: Credenciais de acesso ao MySQL incorretas (usuário/senha)." });
    } else {
      reply.status(500).send({ mensagem: "ERRO DESCONHECIDO ao obter carros. Verifique o terminal do backend." });
    }
  } finally {
    if (conn) {
      await conn.end();
    }
  }
});

app.post("/Carros", async (request: FastifyRequest, reply: FastifyReply) => {
  const { nome, marca, preco, cor, categoria, ano, descricao, linkimg } =
    request.body as any;
  let conn: Connection | undefined;
  try {
    conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "AutoStar",
      port: 3306,
    });
    const [resultado] = await conn.query(
      "INSERT INTO Carros (nome,marca,preco,cor,categoria,ano,descricao,linkimg) VALUES (?,?,?,?,?,?,?,?)",
      [nome, marca, preco, cor, categoria, ano, descricao, linkimg],
    );
    reply.status(200).send(resultado);
  } catch (erro: any) {
    console.error("ERRO ao criar Carro:", erro);
    switch (erro.code) {
      case "ECONNREFUSED":
        reply.status(500).send({ mensagem: "ERRO: O servidor do banco de dados (Laragon) não está ligado ou acessível." });
        break;
      case "ER_BAD_DB_ERROR":
        reply.status(500).send({ mensagem: "ERRO: O nome do banco de dados está incorreto ou o banco de dados não existe." });
        break;
      case "ER_ACCESS_DENIED_ERROR":
        reply.status(401).send({ mensagem: "ERRO: Credenciais de acesso ao MySQL incorretas (usuário/senha)." });
        break;
      case "ER_DUP_ENTRY":
        reply.status(409).send({ mensagem: "ERRO: Registro duplicado. Este ID ou entrada única já existe." });
        break;
      default:
        reply.status(500).send({ mensagem: "ERRO DESCONHECIDO ao cadastrar carro. Verifique o terminal do backend." });
        break;
    }
  } finally {
    if (conn) {
      await conn.end();
    }
  }
});

app.put("/Carros/:id", async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const { nome, marca, preco, cor, categoria, ano, descricao, linkimg } =
    request.body as any;
  let conn: Connection | undefined;
  try {
    conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "AutoStar",
      port: 3306,
    });
    const [resultado] = await conn.query(
      "UPDATE Carros SET nome = ?, marca = ?, preco = ?, cor = ?, categoria = ?, ano = ?, descricao = ?, linkimg = ? WHERE id = ?",
      [nome, marca, preco, cor, categoria, ano, descricao, linkimg, id],
    );
    if ((resultado as any).affectedRows === 0) {
      reply.status(404).send({ mensagem: "Carro não encontrado para atualização." });
      return;
    }
    reply
      .status(200)
      .send({ mensagem: "CARRO ATUALIZADO COM SUCESSO!", resultado });
  } catch (erro: any) {
    console.error("ERRO ao atualizar Carro:", erro);
    reply.status(500).send({ mensagem: "ERRO INTERNO AO ATUALIZAR CARRO. Verifique o terminal do backend." });
  } finally {
    if (conn) {
      await conn.end();
    }
  }
});

app.delete(
  "/Carros/:id",
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    let conn: Connection | undefined;
    try {
      conn = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "AutoStar",
        port: 3306,
      });

      await conn.beginTransaction();

      await conn.query("DELETE FROM Vendas WHERE carro_id = ?", [id]);
      console.log(`Deleted Vendas records for carro_id: ${id}`);

      const [resultado] = await conn.query("DELETE FROM Carros WHERE id = ?", [
        id,
      ]);

      if ((resultado as any).affectedRows === 0) {
        await conn.rollback();
        reply.status(404).send({ mensagem: "Carro não encontrado para exclusão." });
        return;
      }

      await conn.commit();

      reply
        .status(200)
        .send({
          mensagem: "CARRO E VENDAS RELACIONADAS EXCLUÍDOS COM SUCESSO",
          resultado,
        });
    } catch (erro: any) {
      if (conn) {
        await conn.rollback();
      }
      console.error("ERRO ao excluir Carro:", erro);
      reply.status(500).send({ mensagem: "ERRO INTERNO AO EXCLUIR CARRO. Verifique o terminal do backend." });
    } finally {
      if (conn) {
        await conn.end();
      }
    }
  },
);

app.get("/Clientes", async (request: FastifyRequest, reply: FastifyReply) => {
  let conn: Connection | undefined;
  try {
    conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "AutoStar",
      port: 3306,
    });
    const [dados, estruturaTabela] = await conn.query("SELECT * FROM Clientes");
    reply.status(200).send(dados);
  } catch (erro: any) {
    console.error("ERRO ao obter Clientes:", erro);
    if (erro.code === "ECONNREFUSED") {
      reply.status(500).send({ mensagem: "ERRO: O servidor do banco de dados (Laragon) não está ligado ou acessível." });
    } else if (erro.code === "ER_BAD_DB_ERROR") {
      reply.status(500).send({ mensagem: "ERRO: O nome do banco de dados está incorreto ou o banco de dados não existe." });
    } else if (erro.code === "ER_ACCESS_DENIED_ERROR") {
      reply.status(401).send({ mensagem: "ERRO: Credenciais de acesso ao MySQL incorretas (usuário/senha)." });
    } else {
      reply.status(500).send({ mensagem: "ERRO DESCONHECIDO ao obter clientes. Verifique o terminal do backend." });
    }
  } finally {
    if (conn) {
      await conn.end();
    }
  }
});

app.post("/Clientes", async (request: FastifyRequest, reply: FastifyReply) => {
  const { id, nome, email, telefone } = request.body as any;
  let conn: Connection | undefined;
  try {
    conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "AutoStar",
      port: 3306,
    });
    const [resultado] = await conn.query(
      "INSERT INTO clientes (id,nome,email,telefone) VALUES (?,?,?,?)",
      [id, nome, email, telefone],
    );
    reply.status(200).send(resultado);
  } catch (erro: any) {
    console.error("ERRO ao criar Cliente:", erro);
    switch (erro.code) {
      case "ECONNREFUSED":
        reply.status(500).send({ mensagem: "ERRO: O servidor do banco de dados (Laragon) não está ligado ou acessível." });
        break;
      case "ER_BAD_DB_ERROR":
        reply.status(500).send({ mensagem: "ERRO: O nome do banco de dados está incorreto ou o banco de dados não existe." });
        break;
      case "ER_ACCESS_DENIED_ERROR":
        reply.status(401).send({ mensagem: "ERRO: Credenciais de acesso ao MySQL incorretas (usuário/senha)." });
        break;
      case "ER_DUP_ENTRY":
        reply.status(409).send({ mensagem: "ERRO: Registro duplicado. Este ID ou entrada única já existe." });
        break;
      default:
        reply.status(500).send({ mensagem: "ERRO DESCONHECIDO ao cadastrar cliente. Verifique o terminal do backend." });
        break;
    }
  } finally {
    if (conn) {
      await conn.end();
    }
  }
});

app.put("/Clientes", async (request: FastifyRequest, reply: FastifyReply) => {
  const { id, nome, email, telefone } = request.body as any;
  let conn: Connection | undefined;
  try {
    conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "AutoStar",
      port: 3306,
    });
    const [resultado] = await conn.query(
      "UPDATE Clientes SET nome = ?, email = ?, telefone = ? WHERE id = ?",
      [nome, email, telefone, id],
    );
    if ((resultado as any).affectedRows === 0) {
      reply.status(404).send({ mensagem: "Cliente não encontrado para atualização." });
      return;
    }
    reply
      .status(200)
      .send({ mensagem: "CLIENTE ATUALIZADO COM SUCESSO!", dados: resultado });
  } catch (erro: any) {
    console.error("ERRO ao atualizar Cliente:", erro);
    reply.status(500).send({ mensagem: "ERRO INTERNO AO ATUALIZAR CLIENTE. Verifique o terminal do backend." });
  } finally {
    if (conn) {
      await conn.end();
    }
  }
});

app.delete(
  "/Clientes/:id",
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as any;
    let conn: Connection | undefined;
    try {
      conn = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "AutoStar",
        port: 3306,
      });
      const [resultado] = await conn.query(
        "DELETE FROM Clientes WHERE id = ?",
        [id],
      );
      if ((resultado as any).affectedRows === 0) {
        reply.status(404).send({ mensagem: "Cliente não encontrado para exclusão." });
        return;
      }
      reply
        .status(200)
        .send({ mensagem: "CLIENTE EXCLUÍDO COM SUCESSO", dados: resultado });
    } catch (erro: any) {
      console.error("ERRO ao excluir Cliente:", erro);
      reply.status(500).send({ mensagem: "ERRO INTERNO AO EXCLUIR CLIENTE. Verifique o terminal do backend." });
    } finally {
      if (conn) {
        await conn.end();
      }
    }
  },
);

app.listen({ port: 8000 }, (erro, endereco) => {
  if (erro) {
    console.error("ERRO: Fastify não iniciou", erro);
  }
  console.log(`Fastify iniciado na porta: ${endereco}`);
});
