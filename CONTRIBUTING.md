# Contributing to Cvify

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cvify.git
   cd cvify
   ```
3. **Install dependencies**
   ```bash
   bun install
   ```
4. **Setup environment**
   ```bash
   cp .env.example .env
   # Add your GROQ_API_KEY to .env
   ```
5. **Start development**
   ```bash
   bunx prisma generate
   bunx prisma migrate dev
   bun run start:dev
   ```

## How to Contribute

### Reporting Bugs

1. Check if the bug is already reported in Issues
2. Create a new issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (OS, Node version, etc.)

### Suggesting Features

1. Check existing issues for similar suggestions
2. Create a new issue describing:
   - What you want to add
   - Why it's useful
   - How it might work

### Submitting Code

1. **Create a branch**

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes**
   - Write clean code
   - Follow existing code style
   - Add comments for complex logic
   - Test your changes

3. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: description"
   ```

4. **Push to your fork**

   ```bash
   git push origin feat/your-feature-name
   ```

5. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Describe your changes
   - Link related issues

## Code Style

### General Rules

- Use TypeScript for backend code
- Use descriptive variable names
- Add types to function parameters and returns
- Keep functions small and focused
- Add comments for complex logic

### Formatting

```bash
# Format code before committing
bun run format

# Check for linting issues
bun run lint
```

### Naming Conventions

- **Files**: kebab-case (`my-file.ts`)
- **Classes**: PascalCase (`MyClass`)
- **Functions**: camelCase (`myFunction`)
- **Constants**: UPPER_SNAKE_CASE (`MY_CONSTANT`)

## Project Structure

```
src/
├── profiles/          # Profile management
├── cvs/              # CV generation
├── groq/             # AI service
├── prisma/           # Database
└── middleware/       # HTTP middleware
```

## Database Changes

If you modify the database schema:

1. **Edit** `prisma/schema.prisma`
2. **Create migration**
   ```bash
   bunx prisma migrate dev --name describe_your_change
   ```
3. **Test migration** works correctly
4. **Include migration files** in your PR

## Testing Changes

### Manual Testing

1. Start the development server
2. Test in browser at http://localhost:3000
3. Test API endpoints with curl or Postman
4. Check database changes in Prisma Studio

### Before Submitting

- [ ] Code runs without errors
- [ ] No TypeScript errors
- [ ] Features work as expected
- [ ] Database migrations work
- [ ] Code is formatted
- [ ] Changes are documented

## Pull Request Guidelines

### Good PR

- Clear title describing the change
- Description of what changed and why
- Links to related issues
- Screenshots (if UI changes)
- Small, focused changes

### PR Description Template

```markdown
## What

Brief description of changes

## Why

Why this change is needed

## How

How you implemented it

## Testing

How you tested it

## Related Issues

Fixes #123
```

## Areas to Contribute

### Easy Tasks

- Fix typos in documentation
- Improve error messages
- Add input validation
- Improve UI/UX

### Medium Tasks

- Add new profile fields
- Improve PDF styling
- Add profile export/import

### Advanced Tasks

- Add multiple AI providers
- Add CV templates
- Add authentication
- Add real-time collaboration

## Getting Help

- **Documentation**: Check `docs/` folder
- **Issues**: Search existing issues
- **Discussions**: Ask questions in GitHub Discussions
- **Email**: Contact maintainers

## Code of Conduct

- Be respectful and professional
- Welcome newcomers
- Focus on constructive feedback
- Help others learn

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Recognition

Contributors will be:

- Listed in the project
- Credited in release notes
- Thanked in documentation

Thank you for contributing! 🎉
