#!/usr/bin/env node

/**
 * Validate all YAML rules against the schema and test their patterns
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Ajv = require('ajv');

const RULES_DIR = path.join(__dirname, '..', 'rules');
const SCHEMA_PATH = path.join(__dirname, '..', 'schemas', 'rule.schema.json');

// Load schema
const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

let totalRules = 0;
let validRules = 0;
let failedRules = [];

/**
 * Recursively find all YAML files
 */
function findYamlFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findYamlFiles(fullPath));
    } else if (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Validate a single rule file
 */
function validateRule(filePath) {
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const rule = yaml.load(content);

    // Validate against schema
    const valid = validate(rule);
    if (!valid) {
      return {
        valid: false,
        errors: validate.errors.map(e => `${e.instancePath} ${e.message}`),
      };
    }

    // Validate regex patterns compile
    if (rule.detection?.patterns) {
      for (const pattern of rule.detection.patterns) {
        try {
          new RegExp(pattern.regex, pattern.flags || 'gi');
        } catch (e) {
          return {
            valid: false,
            errors: [`Invalid regex "${pattern.regex}": ${e.message}`],
          };
        }
      }
    }

    // Run test cases if present
    if (rule.test_cases) {
      const errors = [];

      for (const shouldMatch of (rule.test_cases.should_match || [])) {
        let matched = false;
        for (const pattern of (rule.detection?.patterns || [])) {
          const regex = new RegExp(pattern.regex, pattern.flags || 'gi');
          if (regex.test(shouldMatch)) {
            matched = true;
            break;
          }
        }
        if (!matched) {
          errors.push(`Test case should match but didn't: "${shouldMatch.substring(0, 50)}..."`);
        }
      }

      for (const shouldNotMatch of (rule.test_cases.should_not_match || [])) {
        for (const pattern of (rule.detection?.patterns || [])) {
          const regex = new RegExp(pattern.regex, pattern.flags || 'gi');
          if (regex.test(shouldNotMatch)) {
            errors.push(`Test case should NOT match but did: "${shouldNotMatch.substring(0, 50)}..."`);
            break;
          }
        }
      }

      if (errors.length > 0) {
        return { valid: false, errors };
      }
    }

    return { valid: true };

  } catch (e) {
    return {
      valid: false,
      errors: [`Failed to parse: ${e.message}`],
    };
  }
}

// Main
console.log('Validating Declawed community rules...\n');

const files = findYamlFiles(RULES_DIR);

for (const file of files) {
  totalRules++;
  const relativePath = path.relative(path.join(__dirname, '..'), file);
  const result = validateRule(file);

  if (result.valid) {
    validRules++;
    console.log(`✓ ${relativePath}`);
  } else {
    failedRules.push({ path: relativePath, errors: result.errors });
    console.log(`✗ ${relativePath}`);
    for (const error of result.errors) {
      console.log(`  - ${error}`);
    }
  }
}

console.log(`\n${validRules}/${totalRules} rules valid`);

if (failedRules.length > 0) {
  console.log('\nFailed rules:');
  for (const rule of failedRules) {
    console.log(`  - ${rule.path}`);
  }
  process.exit(1);
}

console.log('\nAll rules validated successfully!');
