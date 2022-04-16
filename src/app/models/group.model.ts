import { User } from './user.model';

export class Group {
  constructor(public name: string = '', public users: User[] = []) {}
}
