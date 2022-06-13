import { getConnection } from '../database/database';

const getUsers = async (req, res) => {
    try{
        const connection = await getConnection();
        const result = await connection.query('SELECT u.id, u.rfc, u.first_name, u.last_name, p.c_personal, p.nip, p.saldo, e.c_empresarial, e.nip as nip_e, e.saldo as saldo_e FROM users u LEFT JOIN cuenta_personal p ON u.id = p.id LEFT JOIN cuenta_empresarial e ON u.id = e.id');
        // const result = await connection.query('(SELECT u.id, u.rfc, u.first_name, u.last_name,e.c_empresarial as account_number, e.nip as nip_e, e.saldo as saldo_e FROM users u JOIN cuenta_empresarial e ON u.id = e.id) UNION (SELECT u.id, u.rfc, u.first_name, u.last_name, p.c_personal, p.nip, p.saldo FROM users u JOIN cuenta_personal p ON u.id = p.id)');
        res.json(result);
    }
    catch (error){
        res.status(500);
        res.send(error.message);
    }
};

const getUser = async (req, res) => {
    try{
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("SELECT u.id, u.rfc, u.first_name, u.last_name, p.c_personal, p.nip, p.saldo, e.c_empresarial, e.nip as nip_e, e.saldo as saldo_e FROM users u LEFT JOIN cuenta_personal p ON u.id = ? INNER JOIN cuenta_empresarial e ON u.id = ?", [id, id]);
        //get rfc from json obtained from request
        
        res.json(result);
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}

const addUser = async (req, res) => {
    try{
        const { rfc, first_name, last_name } = req.body;

        if(rfc===undefined || first_name===undefined || last_name===undefined){
            res.status(400).json({message:"Faltan datos"});
        }

        const user = { rfc, first_name, last_name };

        const connection = await getConnection();
        await connection.query("INSERT INTO users SET ?", user);
        res.json({message:'User added successfully'});
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}

const updateUser = async (req, res) => {
    try{
        const { id } = req.params;
        const { name, tipo_cuenta, saldo } = req.body;

        if(id===undefined || name===undefined || tipo_cuenta===undefined || saldo===undefined){
            res.status(400).json({message:"Faltan datos"});
        }

        const user = { id, name, tipo_cuenta, saldo };

        const connection = await getConnection();
        const result = await connection.query("UPDATE users SET ? WHERE id = ?", [user, id]);
        res.json(result);
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}

const deleteUser = async (req, res) => {
    try{
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM users WHERE id = ?", id);
        res.json(result);
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}

const getAllAccountNumber = async (req, res) => {
    try{
        const connection = await getConnection();
        const result = await connection.query('(SELECT e.c_empresarial FROM cuenta_empresarial e) UNION (SELECT p.c_personal FROM cuenta_personal p)');
        res.json(result); //returns all account numbers
    }
    catch (error){
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