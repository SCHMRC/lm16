import { Project } from './project';

export class Order {
  data: string;
  oid: string;
  nome: string;
  pezzi: number;
  progetto: Project[];
  externalWork: string;
  external: boolean;
  completed: boolean;
  draftAccepted: boolean;
  draft: any[];

  constructor(data: string, oid: string, nome: string, pezzi: number, progetto: Project[], externalWork: string ,
              external: boolean , completed: boolean, draft: any[], draftAccepted: boolean){
    this.data = data;
    this.nome = nome;
    this.pezzi = pezzi;
    this.oid = oid;
    this.progetto = progetto;
    this.externalWork = externalWork;
    this.external = external;
    this.completed = completed;
    this.draft = draft;
    this.draftAccepted = draftAccepted;

  }
  public getCompleted(){
    return this.completed;
  }

  public setCompleted(param: boolean){
    this.completed = param;

  }
}
