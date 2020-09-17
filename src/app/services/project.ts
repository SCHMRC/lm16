import { FormGroup } from '@angular/forms';
import { Part } from './part';

export class Project {
  image?: string[];
  projectNumber?: number;
  materiale: string;
  spessore?: number;
  copie: number;
  formati?: string;
  forma?: string;
  calpestabile?: boolean;
  orientamento?: string;
  plastificato?: boolean;
  colore?: string;
  luminosa?: boolean;
  tipoVeicolo?: string;
  descrizioneVeicolo?: Part[];
  opalino?: boolean;
  palo?: number;
  base: number;
  altezza?: number;
  diametro?: number;
  laminazione?: string;
  occhielli?: boolean;
  bifacciale?: boolean;
  pieghe?: boolean;
  lato?: number;
  note?: string;
}
