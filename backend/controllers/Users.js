import User from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async(req, res) =>{
    try {
        const response = await User.findAll({
            attributes:['uid','name','email','role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json('{msg: error.message}');
    }
}

export const getUserById = async(req, res) =>{
    try {
        const response = await User.findOne({
            attributes:['uid','name','email','role'],
            where: {
                uid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createUser = async(req, res) =>{
    const {name, email, password, confPassword, role} = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password does not match"});
    const hashPassword = await argon2.hash(password);
    try {
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(201).json({msg: "Registration Successful"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updateUser = async(req, res) =>{
    const user = await User.findOne({
        where: {
            uid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "user not found"});
    const {name, email, password, confPassword, role} = req.body;
    let hashPassword;
    if(password === "" || password === null){
        hashPassword = user.password
    }else{
        hashPassword = await argon2.hash(password);
    }
    if(password !== confPassword) return res.status(400).json({msg: "Password does not match"});
    try {
        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        },{
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "User Updated"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const blockUser = async (req, res) => {
	const { blocked } = req.body;
	try {
		await Users.findOneAndUpdate({ _id: req.params.id }, { blocked: blocked });
		res.status(201).json({ message: 'user status updated' });
	} catch (error) {
		res.status(501).json({ success: false, message: error.message });
	}
};

export const deleteUser = async(req, res) =>{
    const user = await User.findOne({
        where: {
            uid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "ops! user not found"});
    try {
        await User.destroy({
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "User Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}
