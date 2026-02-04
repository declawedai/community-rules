# Contributing to Declawed Community Rules

Thank you for your interest in contributing to the Declawed community detection rules! This document provides guidelines for contributing new rules or improving existing ones.

## Quick Start

1. Fork this repository
2. Create a new branch: `git checkout -b rule/my-new-rule`
3. Add your rule in the appropriate category folder
4. Add test cases
5. Submit a pull request

## Rule Format

Rules are written in YAML format. See `schemas/rule.schema.json` for the full schema.

### Basic Structure

```yaml
id: my-rule-id                    # Unique, lowercase, hyphens only
name: Human Readable Name
description: |
  Detailed description of what this rule detects and why it's dangerous.
author: your-github-username
references:
  - https://example.com/relevant-research
tags:
  - prompt-injection              # See available tags below
severity: high                    # critical, high, medium, low, info
confidence: 90                    # 0-100
enabled: true

detection:
  patterns:
    - regex: 'pattern-to-match'
      flags: gi                   # g=global, i=case-insensitive
      description: "What this pattern matches"
  condition: any                  # any or all

false_positives:
  - Known false positive scenarios

test_cases:
  should_match:
    - "Text that should trigger this rule"
  should_not_match:
    - "Text that should NOT trigger this rule"
```

### Available Tags

- `prompt-injection` - Attempts to override system instructions
- `jailbreak` - Attempts to bypass AI safety measures
- `data-exfil` - Data exfiltration attempts
- `credential-stealer` - Credential/secret theft
- `crypto-stealer` - Cryptocurrency wallet/seed theft
- `tool-poison` - Malicious tool/function manipulation
- `hidden-text` - Invisible or hidden content
- `obfuscation` - Encoded or obfuscated content

### Severity Levels

- **critical** - Immediate, severe threat (e.g., active exfiltration, jailbreak)
- **high** - Serious threat requiring attention
- **medium** - Moderate risk, potential threat
- **low** - Minor concern, possibly suspicious
- **info** - Informational, no immediate threat

## Directory Structure

Place rules in the appropriate category folder:

```
rules/
├── prompt-injection/    # System prompt manipulation
├── jailbreak/           # Safety bypass attempts
├── data-exfiltration/   # Data theft techniques
├── credential-access/   # Secret/credential theft
├── obfuscation/         # Hidden or encoded content
└── tool-poisoning/      # Malicious tool configs
```

## Writing Good Rules

### Do

- **Be specific** - Avoid overly broad patterns that cause false positives
- **Include test cases** - Both positive and negative examples
- **Document false positives** - Help users understand limitations
- **Add references** - Link to research, CVEs, or examples
- **Use appropriate severity** - Don't over-classify minor issues

### Don't

- **Don't be too broad** - `.*hack.*` will match "hackathon"
- **Don't forget anchoring** - Use `\b` for word boundaries when needed
- **Don't ignore case sensitivity** - Most attacks are case-insensitive
- **Don't skip testing** - Test against both malicious and benign samples

## Testing Your Rules

Before submitting, test your rules locally:

```bash
# Run the validation script
npm test

# Test against sample files
npm run test:samples
```

## Pull Request Process

1. **Title**: Use format `[category] Add rule-name` or `[category] Fix rule-name`
2. **Description**: Explain what the rule detects and provide example attacks
3. **Testing**: Confirm all test cases pass
4. **Review**: A maintainer will review for quality and false positive risk

## Code of Conduct

- Be respectful and constructive
- Focus on improving detection capabilities
- Don't submit rules designed to evade detection
- Report security issues privately to security@declawed.ai

## Questions?

- Open an issue for questions about rule development
- Join our community discussions
- Contact us at community@declawed.ai

Thank you for helping make AI applications safer!
