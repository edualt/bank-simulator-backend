import { getConnection } from '../database/database';

const getUsers = async (req, res) => {
    try{
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM users');
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
        const result = await connection.query("SELECT * FROM users WHERE id = ?", id);
        res.json(result);
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}

const addUser = async (req, res) => {
    try{
        const { name, tipo_cuenta, saldo } = req.body;

        if(name===undefined || tipo_cuenta===undefined || saldo===undefined){
            res.status(400).json({message:"Faltan datos"});
        }

        const user = { name, tipo_cuenta, saldo };

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
    

export const methods = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser
};