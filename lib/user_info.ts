/**
 * Main Auth UserInfo class
 */
export class UserInfo {
  id: number
  uuid: string
  username: string
  email: string
  first_name: string
  last_name: string
  title: string
  avatar: string
  superadmin: boolean
  groups: string[]
  roles: string[]
  permissions: string[]
  apps: string[]
  apis: string[]
  token: string

  public constructor({
    id, uuid, username, email, first_name, last_name,
    title, avatar, superadmin, groups, roles, permissions, apps, apis, token
  }: UserInfo) {
    // Constructor using functional destructuring so I can pass in an object as params
    // https://medium.com/@rileyhilliard/es6-destructuring-in-typescript-4c048a8e9e15
    this.id = id
    this.uuid = uuid
    this.username = username,
    this.email = email
    this.first_name = first_name
    this.last_name = last_name
    this.title = title
    this.avatar = avatar
    this.superadmin = superadmin
    this.groups = groups
    this.roles = roles
    this.permissions = permissions
    this.apps = apps
    this.apis = apis
    this.token = token
  }

}
