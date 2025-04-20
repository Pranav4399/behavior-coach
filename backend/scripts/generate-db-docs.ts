import * as fs from 'fs';
import * as path from 'path';

/**
 * Database Documentation Generator
 * 
 * This script parses the Prisma schema and generates comprehensive
 * documentation in Markdown format.
 */

// Configuration
const SCHEMA_PATH = path.join(__dirname, '../prisma/schema.prisma');
const OUTPUT_PATH = path.join(__dirname, '../docs/database-schema.md');
const DIAGRAM_PATH = path.join(__dirname, '../docs/database-diagram.md');

interface ModelField {
  name: string;
  type: string;
  attributes: string[];
  isRequired: boolean;
  isArray: boolean;
  isRelation: boolean;
  relationName?: string;
  description?: string;
}

interface Model {
  name: string;
  tableName: string;
  fields: ModelField[];
  description?: string;
}

interface EnumValue {
  name: string;
  description?: string;
}

interface Enum {
  name: string;
  values: EnumValue[];
  description?: string;
}

// Parse the schema file
function parseSchema(schemaPath: string): { models: Model[], enums: Enum[] } {
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  const lines = schemaContent.split('\n');
  
  const models: Model[] = [];
  const enums: Enum[] = [];
  
  let currentBlock: 'none' | 'model' | 'enum' = 'none';
  let currentModel: Model | null = null;
  let currentEnum: Enum | null = null;
  let blockComments: string[] = [];
  
  // Process line by line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Collect comments for documentation
    if (line.startsWith('//')) {
      blockComments.push(line.substring(2).trim());
      continue;
    }
    
    // Parse model definition
    if (line.startsWith('model ')) {
      currentBlock = 'model';
      const modelName = line.substring(6, line.indexOf('{')).trim();
      currentModel = {
        name: modelName,
        tableName: modelName.toLowerCase() + 's', // Default table name
        fields: [],
        description: blockComments.join(' ')
      };
      blockComments = [];
      continue;
    }
    
    // Parse enum definition
    if (line.startsWith('enum ')) {
      currentBlock = 'enum';
      const enumName = line.substring(5, line.indexOf('{')).trim();
      currentEnum = {
        name: enumName,
        values: [],
        description: blockComments.join(' ')
      };
      blockComments = [];
      continue;
    }
    
    // End of block
    if (line === '}') {
      if (currentBlock === 'model' && currentModel) {
        // Look for @@map attribute to find the real table name
        for (let j = i - 10; j < i; j++) {
          if (j >= 0 && lines[j].includes('@@map(')) {
            const tableName = lines[j].match(/@@map\("([^"]+)"\)/);
            if (tableName && tableName[1]) {
              currentModel.tableName = tableName[1];
            }
            break;
          }
        }
        models.push(currentModel);
      } else if (currentBlock === 'enum' && currentEnum) {
        enums.push(currentEnum);
      }
      
      currentBlock = 'none';
      currentModel = null;
      currentEnum = null;
      blockComments = [];
      continue;
    }
    
    // Parse model fields
    if (currentBlock === 'model' && currentModel && !line.startsWith('@@')) {
      // Extract field definition
      const parts = line.split(/\s+/);
      if (parts.length >= 2) {
        const fieldName = parts[0];
        let fieldType = parts[1];
        const attributes: string[] = [];
        let isRequired = true;
        let isArray = false;
        let isRelation = false;
        let relationName: string | undefined;
        
        // Check if it's optional (has ?)
        if (fieldType.endsWith('?')) {
          isRequired = false;
          fieldType = fieldType.slice(0, -1);
        }
        
        // Check if it's an array (has [])
        if (fieldType.endsWith('[]')) {
          isArray = true;
          fieldType = fieldType.slice(0, -2);
        }
        
        // Collect attributes
        for (let j = 2; j < parts.length; j++) {
          attributes.push(parts[j]);
        }
        
        // Check if it's a relation
        isRelation = fieldType.charAt(0) === fieldType.charAt(0).toUpperCase() && 
                     fieldType !== 'String' && 
                     fieldType !== 'Int' && 
                     fieldType !== 'Boolean' && 
                     fieldType !== 'DateTime' && 
                     fieldType !== 'Float' && 
                     fieldType !== 'Json';
        
        if (isRelation) {
          relationName = fieldType;
        }
        
        currentModel.fields.push({
          name: fieldName,
          type: fieldType,
          attributes,
          isRequired,
          isArray,
          isRelation,
          relationName,
          description: blockComments.join(' ')
        });
      }
      blockComments = [];
    }
    
    // Parse enum values
    if (currentBlock === 'enum' && currentEnum && !line.includes('{')) {
      currentEnum.values.push({
        name: line,
        description: blockComments.join(' ')
      });
      blockComments = [];
    }
  }
  
  return { models, enums };
}

// Generate Markdown documentation
function generateMarkdown(models: Model[], enums: Enum[]): string {
  let markdown = `# Database Schema Documentation\n\n`;
  markdown += `> Automatically generated from Prisma schema at ${new Date().toLocaleString()}\n\n`;
  markdown += `## Table of Contents\n\n`;
  
  // Generate TOC
  markdown += `### Models\n\n`;
  models.forEach(model => {
    markdown += `- [${model.name}](#${model.name.toLowerCase()})\n`;
  });
  
  markdown += `\n### Enums\n\n`;
  enums.forEach(enumDef => {
    markdown += `- [${enumDef.name}](#${enumDef.name.toLowerCase()})\n`;
  });
  
  // Generate model documentation
  markdown += `\n## Models\n`;
  
  models.forEach(model => {
    markdown += `\n### ${model.name}\n\n`;
    
    if (model.description) {
      markdown += `${model.description}\n\n`;
    }
    
    markdown += `Table: \`${model.tableName}\`\n\n`;
    
    // Fields table
    markdown += `| Field | Type | Required | Attributes | Description |\n`;
    markdown += `| ----- | ---- | -------- | ---------- | ----------- |\n`;
    
    model.fields.forEach(field => {
      let fieldType = field.type;
      if (field.isArray) fieldType += '[]';
      if (!field.isRequired) fieldType += '?';
      
      const attributes = field.attributes.join(', ');
      
      markdown += `| ${field.name} | ${fieldType} | ${field.isRequired ? 'Yes' : 'No'} | ${attributes} | ${field.description || ''} |\n`;
    });
    
    // List relations
    const relations = model.fields.filter(f => f.isRelation);
    if (relations.length > 0) {
      markdown += `\n#### Relations\n\n`;
      relations.forEach(relation => {
        markdown += `- \`${relation.name}\`: ${relation.isArray ? 'One-to-many' : 'One-to-one'} relation with [${relation.relationName}](#${relation.relationName?.toLowerCase()})\n`;
      });
    }
  });
  
  // Generate enum documentation
  markdown += `\n## Enums\n`;
  
  enums.forEach(enumDef => {
    markdown += `\n### ${enumDef.name}\n\n`;
    
    if (enumDef.description) {
      markdown += `${enumDef.description}\n\n`;
    }
    
    // Values table
    markdown += `| Value | Description |\n`;
    markdown += `| ----- | ----------- |\n`;
    
    enumDef.values.forEach(value => {
      markdown += `| ${value.name} | ${value.description || ''} |\n`;
    });
  });
  
  return markdown;
}

// Generate Mermaid ER diagram
function generateERDiagram(models: Model[]): string {
  let diagram = `# Database ER Diagram\n\n`;
  diagram += `> Automatically generated from Prisma schema at ${new Date().toLocaleString()}\n\n`;
  diagram += "```mermaid\nerDiagram\n";
  
  // Generate entities
  models.forEach(model => {
    diagram += `    ${model.tableName} {\n`;
    model.fields.forEach(field => {
      if (!field.isRelation) {
        let fieldType = field.type;
        if (field.isArray) fieldType += '[]';
        diagram += `        ${fieldType} ${field.name}${field.isRequired ? '' : ' PK'}\n`;
      }
    });
    diagram += `    }\n`;
  });
  
  // Generate relationships
  models.forEach(model => {
    const relations = model.fields.filter(f => f.isRelation);
    relations.forEach(relation => {
      if (relation.relationName) {
        const targetModel = models.find(m => m.name === relation.relationName);
        if (targetModel) {
          // Find the reverse relation if it exists
          const reverseRelation = targetModel.fields.find(f => 
            f.isRelation && f.relationName === model.name);
          
          // Determine relationship type
          let relationType = '';
          if (relation.isArray && reverseRelation?.isArray) {
            relationType = "many-to-many";
          } else if (relation.isArray) {
            relationType = "one-to-many";
          } else if (reverseRelation?.isArray) {
            relationType = "many-to-one";
          } else {
            relationType = "one-to-one";
          }
          
          diagram += `    ${model.tableName} ${getRelationSymbol(relationType)} ${targetModel.tableName} : "${relation.name}"\n`;
        }
      }
    });
  });
  
  diagram += "```\n";
  return diagram;
}

// Helper function to get Mermaid relation symbols
function getRelationSymbol(relationType: string): string {
  switch(relationType) {
    case 'one-to-one': return '||--||';
    case 'one-to-many': return '||--o{';
    case 'many-to-one': return '}o--||';
    case 'many-to-many': return '}o--o{';
    default: return '--';
  }
}

// Main function
function main() {
  try {
    const { models, enums } = parseSchema(SCHEMA_PATH);
    
    // Generate Markdown documentation
    const markdown = generateMarkdown(models, enums);
    fs.writeFileSync(OUTPUT_PATH, markdown);
    
    // Generate ER diagram
    const diagram = generateERDiagram(models);
    fs.writeFileSync(DIAGRAM_PATH, diagram);
    
    console.log(`Database documentation generated successfully!`);
    console.log(`- Schema documentation: ${OUTPUT_PATH}`);
    console.log(`- ER diagram: ${DIAGRAM_PATH}`);
  } catch (error) {
    console.error('Error generating database documentation:', error);
  }
}

main(); 