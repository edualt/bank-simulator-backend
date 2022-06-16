import { getConnection } from '../database/database';
import { generateUniqueId } from '../utils/uniqueAccount';

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
        const result = await connection.query("SELECT * FROM users WHERE id=?", id);
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
        

        const user = { rfc, first_name, last_name };
        

        const connection = await getConnection();

        var account_number = generateUniqueId({ length: 12, useLetters: false })

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

const getPersonalAccount = async (req, res) => {
    try{
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM users u JOIN cuenta_personal p ON u.id=? and p.id=?', [id, id])
        res.json(result)
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}

const getEmpresarialAccount = async (req, res) => {
    try{
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM users u JOIN cuenta_empresarial e ON u.id=? and e.id=?', [id, id])
        res.json(result)
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}

const getIdbyRFC = async (req, res) => {
    try{
        const { rfc } = req.body;
        const connection = await getConnection();
        const result = await connection.query('SELECT id FROM users WHERE rfc=?', [rfc])
        res.json(result)
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}

const transfer = async (req, res) => {
    try{
        const { id } = req.params;
        const { cuenta_origen, cuenta_destino, monto } = req.body;
        const connection = await getConnection();

        if(cuenta_origen === cuenta_destino){
            res.status(400).json({ message: "No se puede transferir a la misma cuenta" });
        }
        else if(cuenta_origen.substring(0,1) == "4"){
            const result = await connection.query('SELECT * FROM cuenta_personal WHERE c_personal = ?', [cuenta_origen]); //verify if personal account exists
            if(result.length > 0){
                const result2 = await connection.query('SELECT * FROM cuenta_personal WHERE c_personal = ?', [cuenta_destino]); //verify if personal account exists to transfer to
                const reult2_2 = await connection.query('SELECT * FROM cuenta_empresarial WHERE c_empresarial = ?', [cuenta_destino]); //verify if empresarial account exists to transfer to
                if(result2.length > 0 || reult2_2.length > 0){ //if any of the accounts exists
                    if(result[0].saldo >= monto){
                        await connection.query('UPDATE cuenta_personal SET saldo = saldo - ? WHERE c_personal = ?', [monto, cuenta_origen]);
                        if(cuenta_destino.substring(0,1) == "4"){
                            await connection.query('UPDATE cuenta_personal SET saldo = saldo + ? WHERE c_personal = ?', [monto, cuenta_destino]);
                            res.json({ message: "Transferencia exitosa" });
                        }
                        else{
                            await connection.query('UPDATE cuenta_empresarial SET saldo = saldo + ? WHERE c_empresarial = ?', [monto, cuenta_destino]);
                            res.json({ message: "Transferencia exitosa" });
                        }   
                    }
                    else{
                        res.status(400).json({ message: "Saldo insuficiente" });
                    }
                }
                else{
                    res.status(400).json({ message: "Cuenta destino no existe" });
                }
            }
            else{
                res.status(400).json({ message: "Cuenta origen no existe" });
            }
        }
        else if(cuenta_origen.substring(0,1) == "3"){
            const result = await connection.query('SELECT * FROM cuenta_empresarial WHERE c_empresarial = ?', [cuenta_origen]); //verify if empresarial account exists
            if(result.length > 0){
                const result2 = await connection.query('SELECT * FROM cuenta_empresarial WHERE c_empresarial = ?', [cuenta_destino]); //verify if empresarial account exists to transfer to
                const result2_2 = await connection.query('SELECT * FROM cuenta_personal WHERE c_personal = ?', [cuenta_destino]); //verify if personal account exists to transfer to
                if(result2.length > 0 || result2_2.length > 0){ //if any of the accounts exists
                    await connection.query('SELECT * FROM cuenta_empresarial WHERE c_empresarial = ?', [cuenta_origen]);
                    if(result[0].saldo >= monto){
                        const result4 = await connection.query('UPDATE cuenta_empresarial SET saldo = saldo - ? WHERE c_empresarial = ?', [monto, cuenta_origen]);
                        if(cuenta_destino.substring(0,1) == "4"){
                            await connection.query('UPDATE cuenta_personal SET saldo = saldo + ? WHERE c_personal = ?', [monto, cuenta_destino]);
                            res.json({ message: "Transferencia exitosa" });
                        }
                        else{
                            await connection.query('UPDATE cuenta_empresarial SET saldo = saldo + ? WHERE c_empresarial = ?', [monto, cuenta_destino]);
                            res.json({ message: "Transferencia exitosa" });
                        } 
                    }
                    else{
                        res.status(400).json({ message: "Saldo insuficiente" });
                    }
                }
                else{
                    res.status(400).json({ message: "Cuenta destino no existe" });
                }
            }
            else{
                res.status(400).json({ message: "Cuenta origen no existe" });
            }
        }
        else{
            res.status(400).json({ message: "Cuenta origen no existe" });
        }
    
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}

const deposit = async (req, res) => {
    try{
        const { cuenta_origen, monto } = req.body;
        const connection = await getConnection();

        if(cuenta_origen.substring(0,1) == "4"){
            connection.query('UPDATE cuenta_personal SET saldo = saldo + ? WHERE c_personal = ?', [monto, cuenta_origen]);
            res.json({ message: "Deposito exitoso" });
        }
        else{
            connection.query('UPDATE cuenta_empresarial SET saldo = saldo + ? WHERE c_empresarial = ?', [monto, cuenta_origen]);
            res.json({ message: "Deposito exitoso" });
        }
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}

const withdraw = async (req, res) => {
    try{
        const { cuenta_origen, monto } = req.body;

        const connection = await getConnection();

        if(cuenta_origen.substring(0,1) == "4"){
            const result = await connection.query('SELECT * FROM cuenta_personal WHERE c_personal = ?', [cuenta_origen]); //verify if personal account exists
            if(result.length > 0){
                if(result[0].saldo >= monto){
                    await connection.query('UPDATE cuenta_personal SET saldo = saldo - ? WHERE c_personal = ?', [monto, cuenta_origen]);
                    res.json({ message: "Retiro exitoso" });
                }
                else{
                    res.status(400).json({ message: "Saldo insuficiente" });
                }
            }
        }
        else{
            const result = await connection.query('SELECT * FROM cuenta_empresarial WHERE c_empresarial = ?', [cuenta_origen]); //verify if empresarial account exists
            if(result.length > 0){
                if(result[0].saldo >= monto){
                    await connection.query('UPDATE cuenta_empresarial SET saldo = saldo - ? WHERE c_empresarial = ?', [monto, cuenta_origen]);
                    res.json({ message: "Retiro exitoso" });
                }
                else{
                    res.status(400).json({ message: "Saldo insuficiente" });
                }
            }
        }
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}

const deleteAccount = async (req, res) => {
    try{
        const { account_number } = req.body;
        const connection = await getConnection();

        if(account_number.substring(0,1) == "4"){
            await connection.query('DELETE FROM cuenta_personal WHERE c_personal = ?', [account_number]);
            res.json({ message: "Cuenta eliminada" });
        }
        else{
            await connection.query('DELETE FROM cuenta_empresarial WHERE c_empresarial = ?', [account_number]);
            res.json({ message: "Cuenta eliminada" });
        }
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}



export const methods = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser,
    getAllAccountNumber,
    getPersonalAccount,
    getEmpresarialAccount,
    getIdbyRFC,
    transfer,
    deposit,
    withdraw,
    deleteAccount
};