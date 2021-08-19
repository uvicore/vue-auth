/**
 * Main Auth UserInfo class
 */
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
  apps: string[]
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
    title, avatar, groups, roles, permissions, apps, superadmin, token
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
    this.apps = apps
    this.superadmin = superadmin
    this.token = token
  }

}
