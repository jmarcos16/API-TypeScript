import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { UserModel } from "../database/models/UserModels";

class UserController {
  async findAll(req: Request, res: Response) {
    const users = await UserModel.findAll();
    return users.length > 0
      ? res.status(200).json(users)
      : res.status(204).send();
  }

  async findOne(req: Request, res: Response) {
    const { userID } = req.params;
    const user = await UserModel.findOne({
      where: {
        id: userID,
      },
    });
    return user ? res.status(200).json(user) : res.status(204).send();
  }

  async create(req: Request, res: Response) {
    const { email, nome, password } = req.body;

    // Validation body
    if (!email) {
      return res.status(422).json({ msg: "Email é Obrigatório!" });
    }
    if (!nome) {
      return res.status(422).json({ msg: "Nome é Obrigatório!" });
    }
    if (!password) {
      return res.status(422).json({ msg: "Senha é Obrigatória!" });
    }

    // Validate if Exist

    const UserExist = await UserModel.findOne({
      // eslint-disable-next-line object-shorthand
      where: { email: email },
    });

    if (UserExist) {
      return res.status(404).json({ msg: "Email já cadastrado" });
    }

    // Create Password
    const salt = await bcrypt.genSalt(8);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User
    // eslint-disable-next-line no-unused-vars
    const user = await UserModel.create({
      email,
      nome,
      password: passwordHash,
    });

    try {
      return res.status(201).json({ msg: "Usuário cadastrado com sucesso!" });
    } catch (error) {
      return res.status(500).json({ msg: "Houve um erro de servidor" });
    }
  }

  async update(req: Request, res: Response) {
    const { userID } = req.params;
    await UserModel.update(req.body, { where: { id: userID } });
    return res.status(204).send();
  }

  async destroy(req: Request, res: Response) {
    const { userID } = req.params;
    await UserModel.destroy({ where: { id: userID } });
    return res.status(204).send();
  }
}

export default new UserController();
