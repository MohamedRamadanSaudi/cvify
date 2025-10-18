# Prisma JSON Types and TypeScript Interface Compatibility

## Issue Summary

When using TypeScript interfaces with Prisma's JSON fields, you may encounter type compatibility errors like:

```
Type 'Link' is not assignable to type 'InputJsonValue'.
Type 'Link' is not assignable to type 'InputJsonObject'.
Index signature for type 'string' is missing in type 'Link'.
```

## Root Cause

Prisma stores JSON data in the database and generates TypeScript types that expect `InputJsonValue` for JSON fields. These generated types require objects to have an **index signature** `[key: string]: any` to be considered valid JSON objects.

Standard TypeScript interfaces that only define specific properties are too strict and don't match Prisma's requirements.

## Example Problem

### Prisma Schema

```prisma
model Users {
  id      Int      @id @default(autoincrement())
  links   Json[]   // Stored as JSON array
  // ... other fields
}
```

### TypeScript Interface (BEFORE - Causes Error)

```typescript
export interface Link {
  type: string;
  url: string;
  // Missing index signature!
}
```

### DTO Usage

```typescript
export class UpdateUserDto {
  @IsOptional()
  links?: Link[]; // Type mismatch with Prisma's InputJsonValue[]
}
```

## Solution

Add an index signature to your interfaces to make them compatible with Prisma's JSON types:

### TypeScript Interface (AFTER - Fixed)

```typescript
export interface Link {
  type: string;
  url: string;
  [key: string]: any; // Index signature added
}
```

## Applied To All Interfaces

The following interfaces were updated with index signatures:

1. **Link** (`src/users/interfaces/link.interface.ts`)
   - Properties: `type`, `url`

2. **Education** (`src/users/interfaces/education.interface.ts`)
   - Properties: `schoolName`, `degree`, `fieldOfStudy`, `grade`, `startDate`, `endDate`, `description`, `location`, `currentlyStudying`

3. **Experience** (`src/users/interfaces/experience.interface.ts`)
   - Properties: `jobTitle`, `companyName`, `employmentType`, `location`, `startDate`, `endDate`, `currentlyWorking`, `description`

4. **Project** (`src/users/interfaces/project.interface.ts`)
   - Properties: `title`, `description`, `technologies`, `links`, `startDate`, `endDate`, `currentlyOngoing`

5. **Activity** (`src/users/interfaces/activity.interface.ts`)
   - Properties: `title`, `description`, `role`, `startDate`, `endDate`, `currentlyOngoing`

6. **Volunteering** (`src/users/interfaces/volunteering.interface.ts`)
   - Properties: `organizationName`, `description`, `role`, `location`, `startDate`, `endDate`, `currentlyVolunteering`

## What the Index Signature Does

```typescript
[key: string]: any;
```

This tells TypeScript:

- The interface can have any additional string-keyed properties
- Makes the interface compatible with Prisma's `InputJsonValue` type
- The interface is now considered a valid JSON object
- Doesn't affect the defined properties or their types

## Best Practices

1. **Always add index signatures** to interfaces used with Prisma JSON fields
2. **Keep type safety** for your main properties while allowing JSON flexibility
3. **Apply consistently** across all interfaces stored as JSON in the database

## Date Fixed

October 18, 2025

## Related Files

- Prisma Schema: `prisma/schema.prisma`
- User Service: `src/users/users.service.ts`
- Update DTO: `src/users/dto/update-user.dto.ts`
- All interface files in: `src/users/interfaces/`
