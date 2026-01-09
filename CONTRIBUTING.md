# Contributing to FraudShield AI

Thank you for your interest in contributing to FraudShield AI! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Be kind, constructive, and professional in all interactions.

---

## How to Contribute

### Reporting Bugs

Before reporting a bug:

1. Check existing [GitHub Issues](https://github.com/your-username/FraudShieldAI/issues)
2. Ensure you're using the latest version
3. Verify the bug is reproducible

**Bug Report Template:**

```markdown
**Describe the bug**
A clear description of the bug.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., macOS 14.0]
- Python: [e.g., 3.11.5]
- Node.js: [e.g., 18.17.0]
- Browser: [e.g., Chrome 120]
```

### Suggesting Features

We welcome feature suggestions! Please:

1. Check if the feature is already planned (see Issues)
2. Describe the use case clearly
3. Explain why this benefits users

### Pull Requests

1. **Fork** the repository
2. **Create a branch** from `main`: `git checkout -b feature/your-feature`
3. **Make changes** following our coding standards
4. **Test** your changes thoroughly
5. **Commit** with clear messages (see below)
6. **Push** to your fork
7. **Open a Pull Request**

---

## Development Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- Git

### Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/FraudShieldAI.git
cd FraudShieldAI

# Backend setup
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Dev dependencies

# Frontend setup
cd frontend
npm install
cd ..

# Run tests
pytest
cd frontend && npm test
```

### Running Locally

```bash
# Terminal 1: Backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```

---

## Coding Standards

### Python (Backend)

- **Style**: Follow PEP 8
- **Formatting**: Use `black` for code formatting
- **Linting**: Use `ruff` for linting
- **Type Hints**: Use type hints for all functions
- **Docstrings**: Use Google-style docstrings

```python
def calculate_risk_score(transaction: Transaction) -> float:
    """Calculate the risk score for a transaction.

    Args:
        transaction: The transaction to analyze.

    Returns:
        A risk score between 0.0 and 1.0.

    Raises:
        ValueError: If transaction data is invalid.
    """
    pass
```

### TypeScript (Frontend)

- **Style**: Follow the existing codebase style
- **Formatting**: Use Prettier
- **Linting**: Use ESLint
- **Types**: Avoid `any`, use proper types

```typescript
interface Transaction {
  id: string;
  amount: number;
  payee: string;
  risk_level: "high" | "medium" | "low";
}
```

### Commit Messages

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```
feat(api): add batch upload endpoint
fix(detection): correct risk score calculation for edge cases
docs(readme): update installation instructions
refactor(providers): extract common logic to base class
test(api): add integration tests for transactions endpoint
```

---

## Testing

### Running Tests

```bash
# Backend tests
pytest

# With coverage
pytest --cov=app --cov-report=html

# Frontend tests
cd frontend
npm test
```

### Writing Tests

- Write tests for all new features
- Maintain test coverage above 80%
- Use descriptive test names
- Test edge cases

```python
def test_high_risk_transaction_detected():
    """Test that transactions with multiple factors are flagged as high risk."""
    transaction = Transaction(
        amount=4200,
        payee="Unknown Corp",
        timestamp=datetime(2026, 1, 5, 3, 47),
        reference="Invoice 2847",
        payee_is_new=True,
    )
    result = detector.analyze(transaction)
    assert result.risk_level == "high"
    assert result.risk_score >= 0.65
```

---

## Pull Request Process

### Before Submitting

- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow convention
- [ ] No secrets or API keys in code

### PR Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactoring

## Testing
How did you test these changes?

## Checklist
- [ ] Tests pass
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. Maintainer reviews within 3 business days
2. Address feedback promptly
3. Squash commits if requested
4. Maintainer merges when approved

---

## Project Structure

```
FraudShieldAI/
├── app/                    # Backend
│   ├── main.py            # Entry point
│   ├── providers/         # AI provider abstraction
│   └── services/          # Business logic
├── frontend/              # Next.js app
│   ├── app/               # Pages
│   └── components/        # React components
├── tests/                 # Test suite
└── docs/                  # Documentation
```

---

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Open a GitHub Issue
- **Security**: Email security@fraudshield.ai

---

## Recognition

Contributors are recognized in:

- GitHub Contributors list
- CHANGELOG.md for significant contributions
- README.md Acknowledgments section

Thank you for contributing to FraudShield AI!
