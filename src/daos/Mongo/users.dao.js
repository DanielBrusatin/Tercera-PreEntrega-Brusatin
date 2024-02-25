import Users from '../models/user.model.js'

class UsersDao {

  static async getUserByCreds({ email, password }) {
    if (email && password) {
      const user = await Users.findOne({email})
      if (user) {
        if (user.password === password) {
          return user
        } else {
          throw new Error('400', {cause: 'Contraseña incorrecta'})
        }
      } else {
        throw new Error('400', { cause: `No existe un usuario con email: ${email}.` })
      }
    } else {
      throw new Error('400', { cause: 'Completar email y contraseña' })
    }
  }

  static async getUserById(uid) {
    return await Users.findById(uid, { first_name: 1, last_name: 1, age: 1, email: 1, rol:1 }).lean()
  }

  static async addUser({ first_name, last_name, age, email, password }) {
    const newUser = {
      first_name,
      last_name,
      age,
      email,
      password
    }
    //Verifico que estén todos los campos obligatorios y lanzo un error si falta alguno
    const missingFields = []
    Object.entries(newUser).forEach(([key, value]) => !value && missingFields.push(key))
    if (missingFields.length) {
      throw new Error('400', { cause: missingFields.length == 1 ? `Falta el campo ${missingFields.join(', ')}` : `Faltan los campos ${missingFields.join(', ')}` })
    }
    //Verifico que no exista el email
    if (await Users.countDocuments({ email })) {
      throw new Error('400', { cause: `Ya existe un usuario con el email ${email}` })
    } else {
      try {
        await new Users(newUser).save()
      } catch {
        throw new Error('500', { cause: 'No se pudo crear el usuario, intentar nuevamente.' })
      }
    }
  }
}

export default UsersDao