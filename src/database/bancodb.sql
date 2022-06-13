CREATE DATABASE banco_up;

USE banco_up;

CREATE TABLE IF NOT EXISTS users(
	id TINYINT(2) NOT NULL AUTO_INCREMENT,
    rfc VARCHAR(13) UNIQUE,
	first_name VARCHAR(100),
	last_name VARCHAR(100),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS cuenta_personal(
	id TINYINT(2) NOT NULL,
    c_personal VARCHAR(16) UNIQUE,
	nip VARCHAR(4),
    saldo INT,
    FOREIGN KEY (id) REFERENCES users(id),
    PRIMARY KEY(c_personal)
);

CREATE TABLE IF NOT EXISTS cuenta_empresarial(
	id TINYINT(2) NOT NULL,
    c_empresarial VARCHAR(16),
    nip VARCHAR(4),
    saldo INT,
    FOREIGN KEY (id) REFERENCES users(id),
    PRIMARY KEY(c_empresarial)
);

 

INSERT INTO users(rfc, first_name, last_name) VALUES('HEAE030929JKL', 'Eduardo', 'Altuzar');
INSERT INTO users(rfc, first_name, last_name) VALUES('SEBA030929LKJ', 'Sebastian', 'Hernandez');
INSERT INTO cuenta_personal(id, c_personal, nip, saldo) VALUES(1, '4152123456789000', '1234', 500);
INSERT INTO cuenta_personal(id, c_personal, nip, saldo) VALUES(1, '4152123456789111', '1111', 2000);
INSERT INTO cuenta_personal(id, c_personal, nip, saldo) VALUES(2, '4152123456789012', '2222', 1200);
INSERT INTO cuenta_empresarial(id, c_empresarial, nip, saldo) VALUES(2, '3142123456789012', '1222', 1233);
INSERT INTO cuenta_empresarial(id, c_empresarial, nip, saldo) VALUES(1, '3142123456789111', '1001', 1400);
INSERT INTO cuenta_empresarial(id, c_empresarial, nip, saldo) VALUES(1, '3142123456781111', '1101', 1500);
INSERT INTO cuenta_empresarial(id, c_empresarial, nip, saldo) VALUES(1, '3142123456711111', '1101', 1500);
INSERT INTO cuenta_empresarial(id, c_empresarial, nip, saldo) VALUES(1, '3142123456111111', '1101', 1500);


INSERT INTO users(rfc, first_name, last_name) VALUES('NNAA03092TRES', 'Nombre', 'Apellido');
INSERT INTO users(rfc, first_name, last_name) VALUES('AAHE030CUATRO', 'Alexis', 'Altuzar');
INSERT INTO cuenta_personal(id, c_personal, nip, saldo) VALUES(3, '415212345678tres', '2222', 1200);
INSERT INTO cuenta_personal(id, c_personal, nip, saldo) VALUES(4, '4152123456cuatro', '2222', 1200);

SHOW TABLES;

SELECT * FROM users JOIN cuenta_personal JOIN cuenta_empresarial ON users.id = cuenta_personal.id = cuenta_empresarial.id;

SELECT * FROM users JOIN cuenta_empresarial ON users.id = cuenta_empresarial.id;

CREATE TABLE IF NOT EXISTS info_user(
	id TINYINT(2) NOT NULL,
    c_personal VARCHAR(16) UNIQUE,
    c_empresarial VARCHAR(16) UNIQUE,
    PRIMARY KEY(id),
    CONSTRAINT fk_id FOREIGN KEY(id) REFERENCES users(id),
    CONSTRAINT fk_personal FOREIGN KEY (c_personal) REFERENCES cuenta_personal(c_personal),
    CONSTRAINT fk_empresarial FOREIGN KEY (c_empresarial) REFERENCES cuenta_empresarial(c_empresarial)
);

SELECT u.id, u.rfc, u.first_name, u.last_name, p.c_personal, p.nip, p.saldo, e.c_empresarial, e.nip, e.saldo FROM users u INNER JOIN cuenta_personal p ON u.id = 1 INNER JOIN cuenta_empresarial e ON u.id = 1;


SELECT * FROM info_user;

SELECT u.id, u.rfc, u.first_name, u.last_name, p.c_personal, p.nip, p.saldo, e.c_empresarial, e.nip, e.saldo FROM users u INNER JOIN cuenta_personal p ON u.id = p.id INNER JOIN cuenta_empresarial e ON u.id = e.id;

SELECT * FROM users;
SELECT * FROM cuenta_personal;
SELECT * FROM cuenta_empresarial;

SELECT * FROM users u INNER JOIN cuenta_personal p ON u.id=p.id;

ALTER TABLE users DROP PRIMARY KEY;
ALTER TABLE migrations ADD id INT PRIMARY KEY AUTO_INCREMENT;