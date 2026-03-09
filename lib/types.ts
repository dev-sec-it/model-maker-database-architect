export type DataType = 'string' | 'integer' | 'boolean' | 'float' | 'date' | 'datetime' | 'text' | 'json';

export interface Column {
  name: string;
  type: DataType;
  isPrimary: boolean;
  isNullable: boolean;
  isUnique: boolean;
  defaultValue?: string | null;
}

export type RelationType = 'one-to-one' | 'one-to-many' | 'many-to-many' | 'many-to-one';

export interface Relation {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: RelationType;
}

export interface Table {
  name: string;
  columns: Column[];
}

export interface DatabaseSchema {
  tables: Table[];
  relations: Relation[];
}
