CREATE DATABASE banco_up;

USE banco_up;

CREATE TABLE IF NOT EXISTS users(
	id_user TINYINT(2) NOT NULL AUTO_INCREMENT,
	name VARCHAR(100),
    tipo_cuenta ENUM('PERSONAL','EMPRESARIAL'),
    saldo INT,
    PRIMARY KEY(id_user)
);

INSERT INTO users(name, tipo_cuenta, saldo) VALUES('lalo', 'PERSONAL', 400);

ALTER TABLE users DROP PRIMARY KEY;
ALTER TABLE migrations ADD id INT PRIMARY KEY AUTO_INCREMENT;
