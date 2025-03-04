import MongoRepository from "../../../lib/repository/mongo.repository.js";
import { IUser, UserModel } from "../model/user.model.js";

class AuthRepository extends MongoRepository<IUser> {
    constructor() {
        super(UserModel);
    }
 
    
}

export default new AuthRepository;