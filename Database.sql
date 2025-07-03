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
  
  CREATE TABLE Vendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carro_id INT,
    cliente_id INT,
    data_venda DATE NOT NULL,
    preco_venda DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (carro_id) REFERENCES Carros(id),
    FOREIGN KEY (cliente_id) REFERENCES Clientes(id)
);

CREATE TABLE Clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20)
);


  






