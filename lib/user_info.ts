// export interface User {
//   id: number,
//   uuid: string,
//   username: string,
//   email: string,
//   firstName: string,
//   lastName: string,
//   title: string,
//   avatar: string,
//   groups: string[], // or Array<string>
//   roles: string[],
//   permissions: string[],
//   superadmin: boolean,
//   //authenticated: boolean,
// }


export class UserInfo {
  id: number
  uuid: string
  username: string
  email: string
  firstName: string
  lastName: string
  title: string
  avatar: string
  groups: string[]
  roles: string[]
  permissions: string[]
  superadmin: boolean
  token: string

  // public constructor(
  //   id: number,
  //   uuid: string,
  //   username: string,
  //   email: string,
  //   firstName: string,
  //   lastName: string,
  //   title: string,
  //   avatar: string,
  //   groups: string[],
  //   roles: string[],
  //   permissions: string[],
  //   superadmin: boolean,
  // ) {
  public constructor({
    id, uuid, username, email, firstName, lastName,
    title, avatar, groups, roles, permissions, superadmin, token
  }: UserInfo) {
    // Constructor using functional destructuring so I can pass in an object as params
    // https://medium.com/@rileyhilliard/es6-destructuring-in-typescript-4c048a8e9e15
    this.id = id
    this.uuid = uuid
    this.username = username,
    this.email = email
    this.firstName = firstName
    this.lastName = lastName
    this.title = title
    this.avatar = avatar
    this.groups = groups
    this.roles = roles
    this.permissions = permissions
    this.superadmin = superadmin
    this.token = token
  }

}




// Experiment with uvicore orm model... NO




// import { reactive, UnwrapRef } from 'vue';
// import { Model, ModelConfig, QueryBuilder, Results } from '@uvicore/vue-orm';


// /**
//  * Auth User Model
//  */
// class UserModel extends Model {
//   id: number
//   uuid: string
//   username: string
//   email: string
//   first_name: string
//   last_name: string
//   title: string
//   avatar: string
//   groups: string[]
//   roles: string[]
//   permissions: string[]
//   superadmin: boolean
//   authenticated: boolean

//   static _config: ModelConfig = {
//     connection: 'wiki',
//     path: '/auth/userinfo',
//   }

//   public constructor({
//     id, uuid, username, email, first_name, last_name, title,
//     avatar, groups, roles, permissions, superadmin, authenticated,
//   }: UserModel) {
//     super();
//     this.id = id
//     this.uuid = uuid
//     this.username = username
//     this.email = email
//     this.first_name = first_name,
//     this.last_name = last_name,
//     this.title = title,
//     this.avatar = avatar
//     this.groups = groups
//     this.roles = roles
//     this.permissions = permissions
//     this.superadmin = superadmin
//     this.authenticated = authenticated
//   }

// }


// /**
//  * Space model statics (because Generics do not work on static properties)
//  */
// export class User extends UserModel {
//   public static query(): QueryBuilder<UserModel> {
//     return new QueryBuilder<UserModel>(UserModel);
//   }

//   public static newRef(): UnwrapRef<Results<UserModel>> {
//     return reactive<Results<UserModel>>(new Results());
//   }
// }
