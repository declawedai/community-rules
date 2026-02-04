# Declawed Community Rules

<img src="logo.png" alt="Declawed" width="200">

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

Community-maintained detection rules for identifying prompt injection, data exfiltration, and other security threats in AI skills, prompts, and agent configurations.

## Overview

These rules power the detection engines at [Declawed.ai](https://declawed.ai), a security scanner for AI skills and MCP server configurations. By making these rules open source, we enable:

- **Community contributions** - Security researchers can add new detection patterns
- **Transparency** - Users can see exactly what we detect and why
- **Improvement** - Collective knowledge makes better detections

## Rule Categories

| Category | Description |
|----------|-------------|
| [prompt-injection](rules/prompt-injection/) | System prompt manipulation attempts |
| [jailbreak](rules/jailbreak/) | AI safety bypass attempts |
| [data-exfiltration](rules/data-exfiltration/) | Data theft and exfil techniques |
| [credential-access](rules/credential-access/) | Secret and credential theft |
| [obfuscation](rules/obfuscation/) | Hidden or encoded malicious content |
| [tool-poisoning](rules/tool-poisoning/) | Malicious tool/MCP configurations |

## Quick Start

### Using Rules with Declawed.ai

These rules are automatically synced to [Declawed.ai](https://declawed.ai). Simply scan your content there to benefit from community rules.

### Using Rules Locally

```bash
# Clone the repository
git clone https://github.com/declawedai/community-rules.git
cd community-rules

# Install dependencies (for validation/testing)
npm install

# Validate all rules
npm test
```

### Rule Format

Rules are written in YAML with regex-based pattern matching:

```yaml
id: ignore-instructions
name: Ignore Previous Instructions
severity: critical
confidence: 95
tags:
  - prompt-injection

detection:
  patterns:
    - regex: 'ignore\s+(all\s+)?(previous|prior)\s+instructions?'
      flags: gi

test_cases:
  should_match:
    - "Ignore all previous instructions"
  should_not_match:
    - "Follow the instructions above"
```

See [schemas/rule.schema.json](schemas/rule.schema.json) for the full schema.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Quick contribution steps:**

1. Fork this repository
2. Create a branch: `git checkout -b rule/my-new-rule`
3. Add your rule with test cases
4. Submit a pull request

## Rule Quality Guidelines

Good rules should:

- **Be specific** - Avoid false positives on legitimate content
- **Include test cases** - Both positive and negative examples
- **Document false positives** - Help users understand limitations
- **Have references** - Link to research or attack examples

## Security

If you discover a bypass or evasion technique for existing rules, please report it responsibly:

- **Email**: security@declawed.ai
- **Do not** open public issues for security vulnerabilities

## License

This project is licensed under the Apache License 2.0 - see [LICENSE](LICENSE) for details.

## Links

- [Declawed.ai](https://declawed.ai) - AI Security Scanner
- [Documentation](https://declawed.ai/docs) - API Documentation
- [Twitter/X](https://x.com/Declawed_ai) - Updates and announcements

---

Made with care by the [Declawed](https://declawed.ai) team and contributors.
