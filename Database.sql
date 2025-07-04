create database AutoStar;
use AutoStar;

CREATE TABLE Carros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    cor varchar(100) not null,
    categoria varchar(100) NOT NULL,
    ano INT NOT NULL,
    descricao varchar(300),
    linkimg varchar(300) NOT NULL
);

  CREATE TABLE Clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20)
);

  CREATE TABLE Vendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carro_id INT,
    cliente_id INT,
    data_venda DATE NOT NULL,
    preco_venda DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (carro_id) REFERENCES Carros(id),
    FOREIGN KEY (cliente_id) REFERENCES Clientes(id)
);

INSERT INTO `autostar`.`clientes` (`id`, `nome`, `email`, `telefone`) VALUES ('1', 'João', 'joao@gmail.com', '67 99999-9999');
INSERT INTO `autostar`.`clientes` (`id`, `nome`, `email`, `telefone`) VALUES ('2', 'Marcos', 'marcos@gmail.com', '67 88888-8888');
INSERT INTO `autostar`.`carros` (`id`, `nome`, `marca`, `preco`, `cor`, `categoria`, `ano`, `descricao`, `linkimg`) VALUES ('1', 'Fusca', 'Ford', '500.00', 'Azul', 'Esportivo', '2025', 'Carro novinho em folha 2025', 'https://fotos-jornaldocarro-estadao.nyc3.cdn.digitaloceanspaces.com/uploads/2018/11/23132828/yydrn95mxzzj7u8v2fnp.png');
INSERT INTO `autostar`.`vendas` (`id`, `carro_id`, `cliente_id`, `data_venda`, `preco_venda`) VALUES ('1', '1', '2', '2005-10-28', '500.00');




  






