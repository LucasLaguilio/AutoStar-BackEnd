    create database AutoStar; => Cria um novo banco de dados com o nome AutoStar,
onde todos os registros e operações serão armazenados.

    use AutoStar; => Define qual database será utilizado para executar os
próximos comandos. 

    CREATE TABLE Carros (                       => Cria a tabela Carros
        id INT AUTO_INCREMENT PRIMARY KEY,      => Identificador único de cada carro (Chave primária) 
                                                (AUTO_INCREMENTE -> faz  com que o id aumente a cada registro automaticamente)
        nome VARCHAR(100) NOT NULL,             => Informação de texto sobre os carros (não pode ser vazia)
        marca VARCHAR(100) NOT NULL,            => Informação de texto sobre os carros (não pode ser vazia)
        preco DECIMAL(10,2) NOT NULL,           => Preço dos carros (com duas casas decimais depois da vírgula) 
                                                (não pode ser vazia)
        cor varchar(100) not null,              => Informação de texto sobre os carros (não pode ser vazia)
        categoria varchar(100) NOT NULL,        => Informação de texto sobre os carros (não pode ser vazia)
        ano INT NOT NULL,                       => Ano de fabricação do carro (número)(não pode ser vazia)
        descricao varchar(300),                 => Informação de texto sobre os carros (não pode ser vazia)
        linkimg varchar(300) NOT NULL           => URL da imagem do carro (não pode ser vazia)
    );

    CREATE TABLE Clientes (                     => Cria a tabela Clientes
        id INT AUTO_INCREMENT PRIMARY KEY,      => Identificador único do cliente (Chave primária)
                                                (AUTO_INCREMENTE -> faz  com que o id aumente a cada registro automaticamente)
        nome VARCHAR(100) NOT NULL,             => Informações pessoais do cliente (texto) (não pode ser vazia)
        email VARCHAR(100) UNIQUE NOT NULL,     => Informações pessoais do cliente (texto) (não pode ser vazia)
                                                (UNIQUE -> garante que não tenha dois clientes com o mesmo email na tabela)
        telefone VARCHAR(20)                    => Informações pessoais do cliente (texto) (não pode ser vazia)
    );

    CREATE TABLE Vendas (                                   => Cria a tabela de Vendas
        id INT AUTO_INCREMENT PRIMARY KEY,                  => Identificador único da venda (Chave primária)
        carro_id INT,                                       => Identificador único do Carro (Qual carro foi vendido?)
        cliente_id INT,                                     => Identificador único do Cliente (Qual cliente comprou?)
        data_venda DATE NOT NULL,                           => DATE (data da venda 'ano-mes-dia') (não pode ser vazia)
        preco_venda DECIMAL(10,2) NOT NULL,                 => Valor da venda (DECIMAL com duas casas depois da vírgula)
        FOREIGN KEY (carro_id) REFERENCES Carros(id),       => Chave estrangeira, referencia ligando a tabela Carros
        FOREIGN KEY (cliente_id) REFERENCES Clientes(id)    => Chave estrangeiro, referencia ligando a tabela Clientes
    );


    INSERT INTO autostar.clientes (id, nome, email, telefone) VALUES ('1', 'João', 'joao@gmail.com', '67 99999-9999');
    INSERT INTO autostar.clientes (id, nome, email, telefone) VALUES ('2', 'Marcos', 'marcos@gmail.com', '67 88888-8888');
    (Insere dados na tabela clientes)

    INSERT INTO autostar.carros (...) VALUES (...);
    (Insere dados na tabela Carros)

    INSERT INTO autostar.vendas (id, carro_id, cliente_id, data_venda, preco_venda) VALUES ('1', '1', '2', '2005-10-28', '500.00');
    (Insere dados na tabela de Vendas)

