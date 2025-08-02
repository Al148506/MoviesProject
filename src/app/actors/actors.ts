export interface ActorDTO {
  id: number;
  name: string;
  birthdate: Date;
  photo?: string;
}
export interface ActorCreateDTO {
  name: string;
  birthdate: Date;
  photo?: File;
}

export interface ActorAutoCompleteDTO {
  id: number;
  name: string;
  character: string;
  photo: string;
}
