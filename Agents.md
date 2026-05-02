# AGENT.md

## Project Structure

Always use a modular and maintainable project structure.

Root structure:

/backend         # FastAPI (Python)
/frontend        # React + Vite
/docs            # Documentation
/tests           # Automated tests
/docker          # Docker configurations (optional)

Always include:

- README.md
- .gitignore
- docker-compose.yml (optional)
- .env.example

---

## Development Strategy

Use incremental development.

Rules:

- Implement one feature at a time.
- Validate every feature before moving to the next.
- Run tests before proceeding.
- Never implement multiple major features simultaneously.

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

---

## Backend Standards

Use:

- FastAPI
- Pydantic for input validation
- SQLAlchemy ORM
- Service Layer pattern
- Repository pattern where applicable

---

## Frontend Standards

Use:

- Functional components
- React Hooks
- Feature-based folder structure
- Context API for state management
- Axios for HTTP requests

Avoid:

- Class components
- Business logic inside UI components

---

## Tools to Use

Always use:

- Git
- Bash
- npm (frontend) / pip (backend)

Code Quality:

- Ruff (Python) / ESLint (JS)
- Black (Python) / Prettier (JS)

Testing:

- pytest + pytest-cov (backend)
- Vitest + @vitest/coverage-v8 (frontend)

---

## Boundaries

Do NOT modify:

- requirements.txt without reason
- package-lock.json without reason
- .env values
- generated migrations unless required

Never remove existing working code unless replacing it safely.

---

## Security

Follow:

- OWASP Top 10
- JWT secure handling (8h expiration)
- Input validation using Pydantic
- Rate limiting
- Password hashing using bcrypt
- SQL injection prevention (SQLAlchemy)

---

## Git Rules

Use Conventional Commits:

feat:
fix:
refactor:
docs:
test:
chore:

Commit after each completed feature.