import { DatabaseSchema, Table, Column, Relation } from './types';

export function generateSQL(schema: DatabaseSchema): string {
    let sql = '';
    for (const table of schema.tables) {
        sql += `CREATE TABLE ${table.name} (\n`;
        const colStrings = table.columns.map((col) => {
            let typeStr = 'VARCHAR(255)';
            switch (col.type) {
                case 'string': typeStr = 'VARCHAR(255)'; break;
                case 'text': typeStr = 'TEXT'; break;
                case 'integer': typeStr = 'INT'; break;
                case 'float': typeStr = 'FLOAT'; break;
                case 'boolean': typeStr = 'BOOLEAN'; break;
                case 'date': typeStr = 'DATE'; break;
                case 'datetime': typeStr = 'DATETIME'; break;
                case 'json': typeStr = 'JSON'; break;
            }

            let colDef = `  ${col.name} ${typeStr}`;
            if (col.isPrimary) colDef += ' PRIMARY KEY';
            if (!col.isNullable && !col.isPrimary) colDef += ' NOT NULL';
            if (col.isUnique && !col.isPrimary) colDef += ' UNIQUE';
            if (col.defaultValue !== undefined && col.defaultValue !== null) colDef += ` DEFAULT '${col.defaultValue}'`;
            return colDef;
        });
        sql += colStrings.join(',\n') + '\n);\n\n';
    }

    for (const rel of schema.relations) {
        if (rel.fromTable && rel.toTable) {
            // Add foreign key constraint
            sql += `ALTER TABLE ${rel.fromTable} ADD CONSTRAINT fk_${rel.fromTable}_${rel.toTable} FOREIGN KEY (${rel.fromColumn}) REFERENCES ${rel.toTable}(${rel.toColumn});\n`;
        }
    }

    return sql;
}

export function generateFlutter(schema: DatabaseSchema): string {
    let dartCode = "import 'package:json_annotation/json_annotation.dart';\n\n";

    for (const table of schema.tables) {
        const className = table.name.charAt(0).toUpperCase() + table.name.slice(1);
        dartCode += `@JsonSerializable()\nclass ${className} {\n`;

        for (const col of table.columns) {
            let dartType = 'String';
            switch (col.type) {
                case 'string': dartType = 'String'; break;
                case 'text': dartType = 'String'; break;
                case 'integer': dartType = 'int'; break;
                case 'float': dartType = 'double'; break;
                case 'boolean': dartType = 'bool'; break;
                case 'date': dartType = 'DateTime'; break;
                case 'datetime': dartType = 'DateTime'; break;
                case 'json': dartType = 'Map<String, dynamic>'; break;
            }
            if (col.isNullable && !col.isPrimary) dartType += '?';
            else if (col.isPrimary) dartType += '?'; // ID is commonly nullable before creation

            dartCode += `  final ${dartType} ${col.name};\n`;
        }

        dartCode += `\n  ${className}({\n`;
        for (const col of table.columns) {
            const isRequired = (!col.isNullable && !col.isPrimary) ? 'required ' : '';
            dartCode += `    ${isRequired}this.${col.name},\n`;
        }
        dartCode += `  });\n\n`;

        dartCode += `  factory ${className}.fromJson(Map<String, dynamic> json) => _$${className}FromJson(json);\n`;
        dartCode += `  Map<String, dynamic> toJson() => _$${className}ToJson(this);\n`;
        dartCode += `}\n\n`;
    }

    dartCode += `// Note: Run 'flutter pub run build_runner build' to generate the .g.dart file for JSON serialization.`;

    return dartCode;
}

export function generateNextJsPrisma(schema: DatabaseSchema): string {
    let prismaCode = 'generator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\n';

    for (const table of schema.tables) {
        const modelName = table.name.charAt(0).toUpperCase() + table.name.slice(1);
        prismaCode += `model ${modelName} {\n`;

        for (const col of table.columns) {
            let prismaType = 'String';
            switch (col.type) {
                case 'string': prismaType = 'String'; break;
                case 'text': prismaType = 'String'; break;
                case 'integer': prismaType = 'Int'; break;
                case 'float': prismaType = 'Float'; break;
                case 'boolean': prismaType = 'Boolean'; break;
                case 'date': prismaType = 'DateTime'; break;
                case 'datetime': prismaType = 'DateTime'; break;
                case 'json': prismaType = 'Json'; break;
            }

            if (col.isNullable && !col.isPrimary) prismaType += '?';

            let attributes = '';
            if (col.isPrimary) attributes += ' @id @default(autoincrement())'; // Assume int id by default for simplicity, can adjust
            if (col.isUnique && !col.isPrimary) attributes += ' @unique';
            if (col.defaultValue !== undefined && col.defaultValue !== null) {
                if (col.type === 'boolean') attributes += ` @default(${col.defaultValue})`;
                else if (['integer', 'float'].includes(col.type)) attributes += ` @default(${col.defaultValue})`;
                else attributes += ` @default("${col.defaultValue}")`;
            }

            prismaCode += `  ${col.name} ${prismaType}${attributes}\n`;
        }

        // Add relation fields
        const relatedFrom = schema.relations.filter(r => r.fromTable === table.name);
        const relatedTo = schema.relations.filter(r => r.toTable === table.name);

        for (const rel of relatedFrom) {
            const relationModelName = rel.toTable.charAt(0).toUpperCase() + rel.toTable.slice(1);
            if (rel.type === 'many-to-one' || rel.type === 'one-to-one') {
                prismaCode += `  ${rel.toTable} ${relationModelName} @relation(fields: [${rel.fromColumn}], references: [${rel.toColumn}])\n`;
            }
        }

        for (const rel of relatedTo) {
            const relationModelName = rel.fromTable.charAt(0).toUpperCase() + rel.fromTable.slice(1);
            if (rel.type === 'one-to-many' || rel.type === 'many-to-one') {
                prismaCode += `  ${rel.fromTable}s ${relationModelName}[]\n`;
            } else if (rel.type === 'one-to-one') {
                prismaCode += `  ${rel.fromTable} ${relationModelName}?\n`;
            }
        }

        prismaCode += `}\n\n`;
    }

    return prismaCode;
}
