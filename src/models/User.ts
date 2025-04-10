import mongoose,{Document,Schema,Model} from 'mongoose'
export interface IUser extends Document{
    name:string,
    email:string,
    password:string,
    role: 'user' | 'admin';
  profileImage?: string;    
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema : Schema<IUser> = new Schema({
    name:{type:String,required:true},    
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}  ,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
      },
      profileImage: {
        type: String,
      },    
    },
    {timestamps:true})

    const userModel : Model<IUser>=mongoose.models.User||mongoose.model<IUser>('User',userSchema);
export default userModel;   