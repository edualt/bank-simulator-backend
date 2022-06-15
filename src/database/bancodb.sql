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
INSERT INTO cuenta_empresarial(id, c_empresarial, nip, saldo) VALUES(1, '3142123456789111', '1001', 5900);
INSERT INTO cuenta_empresarial(id, c_empresarial, nip, saldo) VALUES(1, '3142123456781111', '1101', 2300);
INSERT INTO cuenta_empresarial(id, c_empresarial, nip, saldo) VALUES(1, '3142123456711111', '1101', 5500);
INSERT INTO cuenta_empresarial(id, c_empresarial, nip, saldo) VALUES(1, '3142123456111111', '1101', 9400);


INSERT INTO users(rfc, first_name, last_name) VALUES('NNAA03092TRES', 'Nombre', 'Apellido');
INSERT INTO users(rfc, first_name, last_name) VALUES('AAHE030CUATRO', 'Alexis', 'Altuzar');
INSERT INTO cuenta_personal(id, c_personal, nip, saldo) VALUES(3, '415212345678tres', '2222', 37);
INSERT INTO cuenta_personal(id, c_personal, nip, saldo) VALUES(4, '4152123456cuatro', '2222', 12560);

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

SELECT * FROM users u  JOIN cuenta_personal p ON u.id = p.id   JOIN cuenta_empresarial e ON u.id = e.id ;


SELECT * FROM info_user;

SELECT u.id, u.rfc, u.first_name, u.last_name, p.c_personal, p.nip, p.saldo, e.c_empresarial, e.nip, e.saldo FROM users u INNER JOIN cuenta_personal p ON u.id = p.id INNER JOIN cuenta_empresarial e ON u.id = e.id;

SELECT * FROM users where id=11;
SELECT * FROM cuenta_personal where id=11;
SELECT * FROM cuenta_empresarial WHERE id=11;

(SELECT * FROM cuenta_personal where id=1) UNION (SELECT * FROM cuenta_empresarial WHERE id=1);

SELECT e.id, e.c_empresarial, e.nip, u.id, u.first_name, u.last_name  FROM cuenta_empresarial INNER JOIN users u;

SELECT u.id, u.rfc, u.first_name, e.c_empresarial, e.nip as nip_e, p.c_personal, p.nip FROM users u JOIN cuenta_personal p ON u.id=p.id=1 JOIN cuenta_empresarial e ON u.id=e.id=1;

SELECT u.id, e.c_empresarial, e.nip FROM users u INNER JOIN cuenta_empresarial e ON u.id=2;
(SELECT u.id, u.rfc, u.first_name, e.c_empresarial as num_cuenta, e.nip, e.saldo FROM users u INNER JOIN cuenta_empresarial e ON u.id=2) UNION (SELECT u.id, u.rfc, u.first_name, p.c_personal, p.nip, p.saldo FROM users u INNER JOIN cuenta_personal p ON u.id=2);

ALTER TABLE users DROP PRIMARY KEY;
ALTER TABLE migrations ADD id INT PRIMARY KEY AUTO_INCREMENT;

SELECT * FROM cuenta_empresarial;
SELECT * FROM users u JOIN cuenta_personal p ON u.id=11 and p.id=11;

UPDATE cuenta_empresarial SET saldo = saldo - 100 WHERE c_empresarial = "3142878819774477";
UPDATE cuenta_personal SET saldo = saldo + 12000 WHERE c_personal = "4152970488681747";