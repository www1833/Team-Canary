export type Position =
  | "P"
  | "C"
  | "1B"
  | "2B"
  | "3B"
  | "SS"
  | "LF"
  | "CF"
  | "RF"
  | "DH";

export type ThrowBat = "右投右打" | "右投左打" | "左投左打" | "左投右打";

export type Member = {
  id: string;
  number: number;
  name: string;
  position: Position[];
  throwBat: ThrowBat;
  height?: number;
  weight?: number;
  bio?: string;
  photoUrl?: string;
  isCaptain?: boolean;
  isCoach?: boolean;
  order?: number;
};

export type MemberFilters = {
  query: string;
  position: Position | "";
  throwBat: ThrowBat | "";
  sort: "number-asc" | "number-desc" | "name-asc" | "name-desc";
};

export type MemberFormValues = Omit<Member, "id"> & { id?: string };
