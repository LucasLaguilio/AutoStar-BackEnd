import mysql, { Connection, ConnectionOptions , QueryError } from 'mysql2/promise';
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import { console } from 'inspector';
import { request } from 'http';
import { error } from 'console';

const app = fastify()
app.register(cors)

app.get("/", (request: FastifyRequest, reply: FastifyReply) => {
    reply.send("Fastify Funcionando!")
})
app.get("/Carros", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'AutoStar',
            port: 3306
        });
        const resultado = await conn.query("SELECT * FROM Carros")
        const [dados,estruturaTabela] = resultado
        reply.status(200).send(dados)
        
    } catch (erro:any) {
        if (erro.code === "ECONNREFUSED") {
            console.log("ERRO: LIGUE O SEU LARAGÃO")
            reply.status(400).send({mensagem:"ERRO: LIGUE O SEU LARAGÃO"})
        } else if (erro.code === "ER_BAD_DB_ERROR") {
            console.log("ERRO: CONFIRA O NOME DO BANCO DE DADOS!")
            reply.status(400).send({mensagem:"ERRO: CONFIRA O NOME DO BANCO DE DADOS!"})
        } else if (erro.code === "ER_ACCESS_DENIED_ERROR") {
            console.log("ERRO: VERIFIQUE O NOME E SENHA NA CONEXÃO MYSQL")
            reply.status(400).send({mensagem:"ERRO: VERIFIQUE O NOME E SENHA NA CONEXÃO MYSQL"})
        } else {
            console.log(erro)
            reply.status(400).send({mensagem:"ERRO DESCONHECIDO"})
        }
    }
})
app.post("/Carros", async (request: FastifyRequest, reply: FastifyReply) => {
    const {id,nome,marca,preco,cor,categoria,ano,descricao,linkimg }  = request.body as any
    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'AutoStar',
            port: 3306
        });
        const resultado = 
        await conn.query("INSERT INTO Carros (id,nome,marca,preco,cor,categoria,ano,descricao,linkimg ) VALUES (?,?,?,?,?,?,?,?,? )",
                                                                    [id,nome,marca,preco,cor,categoria,ano,descricao,linkimg])
        const [dados,estruturaTabela] = resultado
        reply.status(200).send(resultado)
        
    } catch (erro:any) {
        switch (erro.code) {
            case "ECONNREFUSED":
                console.log("ERRO: LIGUE O SEU LARAGON!");
                reply.status(400).send({ mensagem: "ERRO: LIGUE O SEU LARAGON!" });
                break;
            case "ER_BAD_DB_ERROR":
                console.log("ERRO: CONFIRA O NOME DO DATABASE!");
                reply.status(400).send({ mensagem: "ERRO: CONFIRA O NOME DO DATABASE!" });
                break;
            case "ER_ACCESS_DENIED_ERROR":
                console.log("ERRO: VERIFIQUE O NOME E A SENHA NA CONEXÃO MYSQL!");
                reply.status(400).send({ mensagem: "ERRO: VERIFIQUE O NOME E A SENHA NA CONEXÃO MYSQL!" });
                break;
            case "ER_DUP_ENTRY":
                console.log("ERRO: VOCÊ DUPLICOU A CHAVE PRIMÁRIA");
                reply.status(400).send({ mensagem: "ERRO: VOCÊ DUPLICOU A CHAVE PRIMÁRIA" });
                break;
            default:
                console.log(erro);
                reply.status(400).send({ mensagem: "ERRO DESCONHECIDO OLHE O TERMINAL DO BACKEND" });
                break;
        }
    }
})

app.get('/Clientes', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'AutoStar',
            port: 3306
        })
        const resultado = await conn.query('SELECT * FROM Clientes')
        const [dados, estruturaTabela] = resultado
        reply.status(200).send(dados)

    } catch (erro:any) {
        if (erro.code === 'ECONNREFUSED'){
            console.log('ERRO: LIGUE O SEU LARAGON!')
            reply.status(400).send({mensagem:'ERRO: LIGUE O SEU LARAGON!'})
        } else if (erro.code === 'ER_BAD_DB_ERROR'){
            console.log('ERRO: CONFIRA O NOME DO DATABASE!')
            reply.status(400).send({mensagem:'ERRO: VERIFIQUE O NOME DO DATABASE!'})
        } else if (erro.code === 'ER_ACCESS_DENIED_ERROR'){
            console.log('ERRO: VERIFIQUE O NOME E A SENHA NA CONEXÃO MYSQL!')
            reply.status(400).send({mensagem: 'ERRO: VERIFIQUE O NOME E A SENHA NA CONEXÃO MYSQL!'})
        } else {
            console.log(erro)
            reply.status(400).send({mensagem: 'ERRO NÃO CONHECIDO, OLHE O TERMINAL!'})
        }
    }
})

app.post('/Clientes', async (request: FastifyRequest, reply: FastifyReply) => {
    const {id,nome,email,telefone} = request.body as any
    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'AutoStar',
            port: 3306
        });
        const resultado = await conn.query('INSERT INTO clientes (id,nome,email,telefone) VALUES (?,?,?,?)', 
            [id,nome,email,telefone])
        const [dados,estruturaTabela] = resultado
        reply.status(200).send(resultado)

    } catch (erro:any){
        switch (erro.code) {
            case "ECONNREFUSED":
                console.log("ERRO: LIGUE O SEU LARAGON!");
                reply.status(400).send({ mensagem: "ERRO: LIGUE O SEU LARAGON!" });
                break;
            case "ER_BAD_DB_ERROR":
                console.log("ERRO: CONFIRA O NOME DO DATABASE!");
                reply.status(400).send({ mensagem: "ERRO: CONFIRA O NOME DO DATABASE!" });
                break;
            case "ER_ACCESS_DENIED_ERROR":
                console.log("ERRO: VERIFIQUE O NOME E A SENHA NA CONEXÃO MYSQL!");
                reply.status(400).send({ mensagem: "ERRO: VERIFIQUE O NOME E A SENHA NA CONEXÃO MYSQL!" });
                break;
            case "ER_DUP_ENTRY":
                console.log("ERRO: VOCÊ DUPLICOU A CHAVE PRIMÁRIA");
                reply.status(400).send({ mensagem: "ERRO: VOCÊ DUPLICOU A CHAVE PRIMÁRIA" });
                break;
            default:
                console.log(erro);
                reply.status(400).send({ mensagem: "ERRO DESCONHECIDO OLHE O TERMINAL DO BACKEND" });
                break;
        }
    }
})

app.put('/Clientes', async (request: FastifyRequest, reply: FastifyReply) => {
    const {id,nome,email,telefone} = request.body as any
    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'AutoStar',
            port: 3306
        })
        const resultado = await conn.query(
            'UPDATE Clientes SET nome = ?, email = ?, telefone = ? WHERE id = ?',
            [nome,email,telefone,id]
        )
        const [dados, estruturaTabela] = resultado
        reply.status(200).send({mensagem: 'CLIENTE ATUALIZADO COM SUCESSO!', dados})
    } catch (erro:any){
        console.log(erro)
        reply.status(400).send({mensagem: 'ERRO AO ATUALIZAR CLIENTE'})
    }
})

app.delete('/Clientes/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as any
    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'AutoStar',
            port: 3306
        })
        const resultado = await conn.query('DELETE FROM Clientes WHERE id = ?', [id])
        const [dados, estruturaTabela] = resultado
        reply.status(200).send({mensagem: 'CLIENTE EXCLUÍDO COM SUCESSO', dados })
    } catch (erro:any) {
        console.log(erro)
        reply.status(400).send({mensagem: 'ERRO AO EXCLUIR CLIENTE'})
    }
})

app.listen({ port: 8000 }, (erro, endereco) => {
    if (erro) {
        console.log("ERRO: Fastify não iniciou")
    }
    console.log(`Fastify iniciado na porta: ${endereco}`)
})
