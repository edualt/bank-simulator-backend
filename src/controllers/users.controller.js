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

        const account_number = Math.floor(Math.random()*1E16).toString(16);
        const tipo_cuenta = req.body.tipo_cuenta;
        const nip = req.body.nip;

        const user = { rfc, first_name, last_name };
        const connection = await getConnection();

        //get all account numbers
        const allAccountNumbers = await connection.query('(SELECT e.c_empresarial FROM cuenta_empresarial e) UNION (SELECT p.c_personal FROM cuenta_personal p)');

        //check if account number already exists
        let accountNumberExists = false;
        allAccountNumbers.forEach(accountNumber => {
            if(account_number===accountNumber.c_empresarial || account_number===accountNumber.c_personal){
                accountNumberExists = true;
            }
        }
        );

        if(accountNumberExists){
            res.status(400).json({message:"Cuenta ya existe"});
        }
        else{
            if(tipo_cuenta==="empresarial"){
                await connection.query('INSERT INTO users SET ?', user);

                //get user id
                const userId = await connection.query('SELECT id FROM users WHERE rfc = ?', rfc);
                const id = userId[0].id;

                await connection.query('INSERT INTO cuenta_empresarial (id, c_empresarial, nip, saldo) VALUES (?, ?, ?, ?)', [id, account_number, nip, 0]);
            }
            else{
                await connection.query('INSERT INTO users SET ?', user)

                const userId = await connection.query('SELECT id FROM users WHERE rfc = ?', rfc);
                const id = userId[0].id;

                await connection.query('INSERT INTO cuenta_personal (c_personal, nip, saldo) VALUES (?, ?, ?, ?)', [id, account_number, nip, 0]);
            }
            await connection.query('INSERT INTO users (rfc, first_name, last_name) VALUES (?, ?, ?)', [rfc, first_name, last_name]);
            res.status(201).json({message:"Usuario agregado"});
        }
    
        
        // getAllAccountNumber(req, res).then(result => {
        //     if(result.length>0){
        //         if(account_number in result){
        //             res.status(400).json({message:"Cuenta ya existe"});
        //         }
        //         else{
        //             if(account_number.length===16 && first_four_digits==='4152' && tipo_cuenta==='Personal'){

        //                 const user = { rfc, first_name, last_name };

        //                 const connection = await getConnection();
        //                 await connection.query("INSERT INTO users SET ?", user);
        //                 res.json({message:'User added successfully'});

        //                 await connection.query("INSERT INTO cuenta_personal SET ?", {id, c_personal:account_number});
        //                 res.json({message:"num cuenta personal creada"});
        //             }
        //             else if(account_number.length===16 && first_four_digits==='3142' && tipo_cuenta==='Empresarial'){

        //                 const user = { rfc, first_name, last_name };

        //                 const connection = await getConnection();
        //                 await connection.query("INSERT INTO users SET ?", user);
        //                 res.json({message:'User added successfully'});

        //                 await connection.query("INSERT INTO cuenta_empresarial SET ?", {id, c_empresarial:account_number});
        //                 res.json({message:"num cuenta empresarial creada"});
        //             }
        //             else{
        //                 res.status(400).json({message:"Account number invalid"});
        //             }
        //         }
        //     }
        // })

        
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}

const setAccountNumber = async (req, res) => {
    try{
        const { id } = req.params;

        //generate 16 digit account number

        const connection = await getConnection();

        //evalue first 4 digits of account number
        
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