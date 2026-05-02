# CONSTITUTION.md

## Project Structure

Always use a modular and maintainable project structure.

Root structure:

/backend         # FastAPI (Python)
/frontend        # React + Vite
/docs            # Documentation
/tests           # Automated tests
/docker          # Docker configurations (optional)

Always include:

- README.md (with TOC)
- .gitignore
- .env.example
- CHANGELOG.md

---

## Development Strategy

Use incremental development (Scrum + Git Flow).

Rules:

- Implement one feature at a time (one user story per PR)
- Validate every feature before moving to the next
- Run tests before proceeding
- Never implement multiple major features simultaneously

---

## Coding Standards

### Python (Backend - FastAPI)

Use:

- snake_case for variables and functions
- PascalCase for classes and Pydantic models
- Ruff or Black for formatting
- Type hints (mandatory)

Follow:

- SOLID principles
- Clean Code
- RESTful API conventions
- Service Layer pattern
- Repository pattern where applicable

### JavaScript (Frontend - React)

Use:

- camelCase for variables
- PascalCase for React components
- ESLint
- Prettier

Follow:

- SOLID principles
- Clean Code
- Feature-based folder structure

Avoid:

- Class components
- Business logic inside UI components

---

## Backend Standards

Use:

- FastAPI
- Pydantic for input validation
- SQLAlchemy ORM
- Async endpoints where possible
- Service Layer pattern

---

## Frontend Standards

Use:

- Functional components
- React Hooks
- Context API for state management
- Axios for HTTP requests
- Tailwind CSS for styling

---

## Testing Strategy (TDD)

Use TDD (Test-Driven Development) for all features.

Cycle:

1. RED - Write failing test
2. GREEN - Implement minimum code to pass
3. REFACTOR - Improve code without breaking tests

Testing Tools:

- pytest + pytest-cov (backend)
- Vitest + @vitest/coverage-v8 (frontend)

Coverage Goal:

- Total ≥ 70%
- Validation module ≥ 80%
- CSP module ≥ 70%

---

## Security

Follow OWASP Top 10:

- JWT with 8h expiration
- Input validation using Pydantic
- SQL injection prevention (SQLAlchemy)
- Password hashing using bcrypt
- Rate limiting
- Environment variables for secrets
- HTTPS in production

---

## Git Rules

Use Conventional Commits:

feat:     # new feature
fix:      # bug fix
refactor: # code refactor
docs:     # documentation
test:     # tests
chore:    # maintenance

Branch strategy (Git Flow):

main      # production (always stable)
develop   # integration
feature/* # new features
release/* # release preparation

Pull Requests:

- Required for main and develop
- Minimum 1 reviewer
- All tests must pass
- Coverage must not decrease

---

## Boundaries

Do NOT modify:

- requirements.txt without reason
- package-lock.json without reason
- .env values (use .env.example)
- generated migrations unless required

Never remove existing working code unless replacing it safely.

---

## Documentation Requirements

Always document:

- API endpoints (FastAPI auto-generates Swagger)
- Database schema (in SPECS.md)
- Setup instructions (in README.md)
- Architectural decisions (in CONSTITUTION.md)

---

## Constitution Amendments

This constitution can be amended only by:

- Team consensus (4/4 votes)
- Agreement from the Product Owner (teacher)

All amendments must be documented in CHANGELOG.md.