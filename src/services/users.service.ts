import bcrypt from "bcrypt";
import { User } from "../models/users.model";


export const createUserService = async (
  name: string,
  email: string,
  password: string,
  role : string
) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("user already existed");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,

    email,
    password: hashedPassword,
    role
  });
  const userObject = newUser.toObject();
  delete userObject.password

  return userObject
};

export const userSigninServices = async (email: string, password: string) => {
  const existing_user = await User.findOne({ email });
  
  if (!existing_user) {
    throw new Error("invalid email and password");
  }
  const isUserMatch = await bcrypt.compare(password, existing_user.password);

 

  if (!isUserMatch) {
    throw new Error("invalid email and password");
  }

  const userObject = existing_user.toObject();
  delete userObject.password

  return userObject
};


export const userUpdataService = async(email : string, userdata: {role:string}
    
) =>{
    const existingUser = User.findOne({email});

    if(!existingUser){
        throw new Error('Invalid email');
    }
    
    const update = await User.findOneAndUpdate(
      {email},
      userdata ,{
        new : true
      }
    )

    const userObject = (await existingUser).toObject();
    delete userObject.password
    
    return userObject
  }