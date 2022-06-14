import { getConnection } from '../database/database';

const getUsers = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT u.id, u.rfc, u.first_name, u.last_name, p.c_personal, p.nip, p.saldo, e.c_empresarial, e.nip as nip_e, e.saldo as saldo_e FROM users u LEFT JOIN cuenta_personal p ON u.id = p.id LEFT JOIN cuenta_empresarial e ON u.id = e.id');
        // const result = await connection.query('(SELECT u.id, u.rfc, u.first_name, u.last_name,e.c_empresarial as account_number, e.nip as nip_e, e.saldo as saldo_e FROM users u JOIN cuenta_empresarial e ON u.id = e.id) UNION (SELECT u.id, u.rfc, u.first_name, u.last_name, p.c_personal, p.nip, p.saldo FROM users u JOIN cuenta_personal p ON u.id = p.id)');
        res.json(result);
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("SELECT u.id, u.rfc, u.first_name, u.last_name, p.c_personal, p.nip, p.saldo, e.c_empresarial, e.nip as nip_e, e.saldo as saldo_e FROM users u JOIN cuenta_personal p ON u.id = ? INNER JOIN cuenta_empresarial e ON u.id = ?", [id, id]);
        //get rfc from json obtained from request

        res.json(result);
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const addUser = async (req, res) => {
    try {
        const { rfc, first_name, last_name, nip, tipo_cuenta } = req.body;

        if (rfc === undefined || first_name === undefined || last_name === undefined) {
            res.status(400).json({ message: "Faltan datos" });
        }

        var personal_account = '4152'
        var empresarial_account = '3142'
        var account_number = '';
        
        
        while (account_number.length < 12) {
            account_number = Math.floor(Math.random() * 1E12).toString();
        }

        const user = { rfc, first_name, last_name };
        

        const connection = await getConnection();

        //check if user already exists
        const result = await connection.query("SELECT * FROM users WHERE rfc = ?", rfc);
        if (result.length > 0) {

            const id = await connection.query("SELECT id FROM users WHERE rfc = ?", rfc); //get id of user just added
            if (tipo_cuenta === "Personal") {
                personal_account = personal_account + account_number;
                const result = await connection.query("SELECT * FROM cuenta_personal WHERE c_personal = ?", personal_account);

                //verify if account number already exists
                if (result.length > 0) {
                    res.status(400).json({ message: "La cuenta ya existe" });
                }
                else {
                    await connection.query("INSERT INTO cuenta_personal SET ?", { id: id[0].id, c_personal: personal_account, nip:nip, saldo: 0 });
                    res.json({ message: "Usuario agregado" });
                }

                
            }
            else {
                empresarial_account = empresarial_account + account_number;
                const result = await connection.query("SELECT * FROM cuenta_empresarial WHERE c_empresarial = ?", empresarial_account);

                //verify if account number already exists
                if (result.length > 0) {
                    res.status(400).json({ message: "La cuenta ya existe" });
                }
                else {
                    await connection.query("INSERT INTO cuenta_empresarial SET ?", { id: id[0].id, c_empresarial: empresarial_account, nip:nip, saldo: 0 });
                    res.json({ message: "Usuario agregado" });
                }
            }
        }
        else {
            //add user to database
            await connection.query("INSERT INTO users SET ?", user);

            const id = await connection.query("SELECT id FROM users WHERE rfc = ?", rfc); //get id of user just added
            //add account to database
            if (tipo_cuenta === "Personal") {
                personal_account = personal_account + account_number;
                const result = await connection.query("SELECT * FROM cuenta_personal WHERE c_personal = ?", personal_account);

                //verify if account number already exists
                if (result.length > 0) {
                    res.status(400).json({ message: "La cuenta ya existe" });
                }
                else {
                    await connection.query("INSERT INTO cuenta_personal SET ?", { id: id[0].id, c_personal: personal_account, nip:nip, saldo: 0 });
                    res.json({ message: "Usuario agregado" });
                }
            }
            else {
                empresarial_account = empresarial_account + account_number;
                const result = await connection.query("SELECT * FROM cuenta_empresarial WHERE c_empresarial = ?", empresarial_account);

                //verify if account number already exists
                if (result.length > 0) {
                    res.status(400).json({ message: "La cuenta ya existe" });
                }
                else {
                    await connection.query("INSERT INTO cuenta_empresarial SET ?", { id: id[0].id, c_empresarial: empresarial_account, nip:nip, saldo: 0 });
                    res.json({ message: "Usuario agregado" });
                }
            }
        }
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const setAccountNumber = async (req, res) => {
    try {
        const { id } = req.params;

        //generate 16 digit account number

        const connection = await getConnection();

        //evalue first 4 digits of account number

    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, tipo_cuenta, saldo } = req.body;

        if (id === undefined || name === undefined || tipo_cuenta === undefined || saldo === undefined) {
            res.status(400).json({ message: "Faltan datos" });
        }

        const user = { id, name, tipo_cuenta, saldo };

        const connection = await getConnection();
        const result = await connection.query("UPDATE users SET ? WHERE id = ?", [user, id]);
        res.json(result);
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM users WHERE id = ?", id);
        res.json(result);
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const getAllAccountNumber = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query('(SELECT e.c_empresarial FROM cuenta_empresarial e) UNION (SELECT p.c_personal FROM cuenta_personal p)');
        res.json(result); //returns all account numbers
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    }
};



export const methods = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser,
    getAllAccountNumber
};