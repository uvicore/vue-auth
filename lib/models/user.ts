export interface User {
  id: number,
  uuid: string,
  username: string,
  email: string,
  firstName: string,
  lastName: string,
  title: string,
  avatar: string,
  groups: string[], // or Array<string>
  roles: string[],
  permissions: string[],
  superadmin: boolean,
  //authenticated: boolean,
}
