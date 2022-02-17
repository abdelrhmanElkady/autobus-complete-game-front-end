import { Answer } from './answer.model';

export class User {
  constructor(
    public connectionId: string = '',
    public name: string = '',
    public answer: Answer = new Answer(),
    public score:number = 0
  ) {}
}
