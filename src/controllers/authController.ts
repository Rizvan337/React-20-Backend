import { Request,Response } from "express"
import User from '../models/User'
import { IUser } from "../models/User"
import { HttpStatus } from "../utils/httpStatus"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
if(!JWT_SECRET) throw new Error('JWT_SECRET must be defined in .env')

export const register = async (req:Request,res:Response): Promise<Response>=>{
    try{
    const {name,email,password} = req.body
    const existingUser : IUser| null = await User.findOne({email})
    if(existingUser){   
        return res.status(HttpStatus.BAD_REQUEST).json({msg:'User already exists'})
    }

    const hash = await bcrypt.hash(password,10)
    const user:IUser = await User.create({name,email,password:hash})
    const token = jwt.sign({id:user._id},JWT_SECRET,{expiresIn:'1h'})

   return res.status(HttpStatus.CREATED).json({
        user:{
            _id:user.id,
            name:user.name,
            email:user.email
        },
        token,
    })
    }catch(error){
        console.error("Register error",error)
       return res.status(HttpStatus.SERVER_ERROR).json({msg:'Server error'})
    }
}

export const login = async(req:Request,res:Response): Promise<Response>=>{
    try {
        const {email,password} = req.body
        const user:IUser|null = await User.findOne({email})
        if(!user){
            return res.status(HttpStatus.NOT_FOUND).json({ msg: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(HttpStatus.UNAUTHORIZED).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({id:user._id},JWT_SECRET,{expiresIn:'1h'})

        return res.status(HttpStatus.OK).json({
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            token,
        })
    } catch (error) {
        console.error('Login error:', error);
        return res.status(HttpStatus.SERVER_ERROR).json({ msg: 'Server error' });
    }
}