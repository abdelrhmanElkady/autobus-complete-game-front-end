export class Marks {
    constructor(
        public boyMark:number = 0,
        public girlMark:number = 0,
        public inanimateMark:number = 0,
        public animalMark:number = 0,
        public plantMark:number = 0,
        public countryMark:number = 0,
    ){}

    totalmark():number{
        return this.boyMark+this.girlMark+this.inanimateMark+this.animalMark+this.plantMark+this.countryMark
    }
}