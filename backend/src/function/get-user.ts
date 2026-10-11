import { User, UserModel } from "../models/user.model.js";

const getUser = async (id: string): Promise<User | null> => {
    try {
        const user = await UserModel.findOne({ user_id: id });
        return user ?? null;
    } catch (error) {
        console.log("Error While Get User : ", error);
        return null;
    }
};

export default getUser;