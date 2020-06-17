# REST API

This document lists the endpoints and actions available through REST. Some will require certain authentication

## Data Types

This section details the minimal data that each endpoint is expected to return or take as input. This data can vary based on the privilege level of the requesting user (admin vs. guardian), as well as the method that is being used

__Note that '!' indicates a field is mandatory or guaranteed. Otherwise it is an optional field.__

### User

```
GET 
    { id:       String!
    , first:    String!
    , last:     String!
    , phone:    String!
    , email:    String!
    }

POST
    { id:       String!
    , first:    String!
    , last:     String!
    , phone:    String!
    , email:    String!
    }

PATCH
    { first:    String
    , last:     String
    , phone:    String
    , email:    String
    }
```


### Guardian

```
GET
    { id:       String!
    , first:    String!
    , last:     String!
    , phone:    String!
    , email:    String!
    , groups:   [String]!
    }

POST
    { first:    String!
    , last:     String!
    , phone:    String!
    , email:    String!
    , groups:   [String]
    }

PATCH
    { first:    String
    , last:     String
    , phone:    String
    , email:    String
    , groups:   [String]
    }
```

### Dependent

```
GET
    { id:       String!
    , first:    String!
    , last:     String!
    , photo:    Image
    , dob:      Date!
    , guardians:    [String]!
    , rxs:      [String]!
    , group:    String
    }

POST 
    { first:    String!
    , last:     String!
    , photo:    Image
    , dob:      Date!
    , group:    String
    }

PATCH
    { first:    String
    , last:     String
    , photo:    Image
    , dob:      Date
    , group:    String
    }
```

### Group

```
GET 
    { id:       String!
    , name:     String!
    , dependents:   [String]!
    , guardians:    [String]!
    }

POST 
    { name:         String!
    , dependents:   [String]!
    , guardians:    [String]!
    }

PATCH
    { name:         String
    , dependents:   [String]
    , guardians:    [String]
    }
```

### Medication

```
What medication info is stored?
```

### Prescription
Def:an instruction written by a medical practitioner that authorizes a patient to be provided a medicine or treatment.
GET
{
    doctorsName:    String!,
    medication:     [Object],
    whenToTake:     [Object],
    howOften:       [Object],
    phoneNumber:    String!,
    intructions:    String,
    idNumber:       String!,
    storeNumber:    String,
    reason:         String!

}
```
What prescription info is stored?
```

### InvalidAuth

Is this just an HTTP code?

### InvalidData

Is this just an HTTP code?

## API

### /api/users/

Interacts with the list of all users in the system

```
GET (): InvalidAuth | [Users]
    - returns list of all users in the system
```

### /api/users/:id

Interacts with a specific user's information. Administrator-only

```
GET (): InvalidAuth | InvalidData | User
    - Returns user information (phone, email, etc)
PATCH (data: User): InvalidAuth | InvalidData | User
    - modifies user information
DELETE (): InvalidAuth | InvalidData | Success
```

### /api/users/me

Interacts with the logged-in user's information

```
GET (): InvalidAuth | User
    - returns info of logged-in user (phone, email, etc)
PATCH (data: User): InvalidAuth | InvalidData | User
    - modifies info of logged-in user, and returns updated info
```

### /api/guardians/

Interacts with the list of all guardians in the system. Requires privileged access.

```
GET (): InvalidAuth | [Guardian]
    - returns list of JSON objects with data of guardians
PUT (data: Guardian): InvalidAuth | InvalidData | Guardian
    - adds new guardian to database. May fail if not authorized, or guardian
      data is invalid.
```

### /api/guardians/:id

This API requests information concerning a specific guardian. :id = me is a special case 

```
GET (): InvalidAuth | InvalidData | Guardian
    - returns JSON of the guardian's data. May fail if guardian is not found
PATCH (data: Guardian): InvalidAuth | InvalidData | Guardian
    - modifies a guardian's data. May fail if guardian is not found or update was rejected
DELETE (): InvalidAuth | InvalidData | Success
```

### /api/guardians/:id/dependents

Interacts with a specific guardian's dependents. :id = me is a special case

```
GET (): InvalidAuth | InvalidData | [Dependent]
    - returns list of the guardian's dependents
```

### /api/guardians/:id/groups

Interacts with a specific guardian's groups. :id = me is a special case

```
GET (): InvalidAuth | InvalidData | [Group]
    - returns list of the guardian's groups
```

### /api/guardians/:id/rxs

Interacts with all the prescriptions that a specific guardian is responsible for. :id = me is a special case

```
GET (): InvalidAuth | InvalidData | [Prescription]
    - returns list of the guardian's dependents' prescriptions
```

### /api/dependents/

Interacts with the list of all children in the system. Requires privileged access 

```
GET (): InvalidAuth | [Dependent]
    - returns list of JSON objects with data of the children
PUT (data: Dependent): InvalidAuth | InvalidData | Dependent
    - creates a dependent. May fail if dependent is not found,
      or insertion is rejected
```

### /api/dependents/:id

Interacts with a specific dependent. Requires privileged access

```
GET (): InvalidAuth | InvalidData | Dependent
    - returns JSON of the dependent. May fail if dependent is not found
PATCH (data: Dependent): InvalidAuth | InvalidData | Dependent
    - modifies a dependent's data. May fail if dependent is not found or update is rejected.
DELETE (): InvalidAuth | InvalidData | Success
```

### /api/dependents/:id/guardians

Interacts with a specific dependent's guardians

```
GET (): InvalidAuth | InvalidData | [Guardian]
    - returns list of dependent's guardians
```

### /api/dependents/:id/groups

Interacts with a specific dependent's groups

```
GET (): InvalidAuth | InvalidData | [Group]
    - returns list of dependent's groups.
```


### /api/dependents/:id/rxs

Interacts with a specific dependent's prescriptions

```
GET (): InvalidAuth | InvalidData | [Prescriptions]
    - returns list of a specific dependent's prescriptions
```

### /api/groups/

Interacts with the list of all groups in the system.

```
GET (): InvalidAuth | [Group]
    - returns JSON list of Group objects
PUT (data: Group): InvalidAuth | InvalidData | Group
    - creates a group.
```

### /api/groups/:id

Interacts with a specific group.

```
GET (): InvalidAuth | InvalidData | Group
    - returns a list of all groups
PATCH (data: Group): InvalidAuth | InvalidData | Group
    - modifies a group.
DELETE (): InvalidAuth | InvalidData | Success
```

### /api/groups/:id/guardians

Interacts with a specific group's guardians

```
GET (): InvalidAuth | InvalidData | [Guardian]
    - returns a list of a group's guardians
```

### /api/groups/:id/dependents

Interacts with a specific group's dependents

```
GET (): InvalidAuth | InvalidData | [Dependent]
    - returns a list of a group's dependents
```

### /api/medications

Interacts with the list of medications

```
GET (): InvalidAuth | [Medication]
```

### /api/medications/:id

Interacts with specific medication

```
GET (): InvalidAuth | InvalidData | [Medication]
    - Returns data on specific medication
PATCH (data: Medication): InvalidAuth | InvalidData | Medication
    - modifies a medication in the system, and returns resulting medication
DELETE (): InvalidAuth | InvalidData | Success
```

### /api/medications/:id/dependents

Interacts with the dependents that take a specific medication

```
GET (): InvalidAuth | InvalidData | [Dependent]
    - Returns list of dependents that take the specific medication
```

### /api/rxs/

Interacts with list of prescriptions in system

```
GET (): InvalidAuth | [Prescription]
    - returns list of prescription in system as JSON
POST (data: Prescription): InvalidAuth | InvalidData | Prescription
    - creates a prescription
```

### /api/rxs/:id

Interacts with a specific prescription in the system

```
GET (): InvalidAuth | InvalidData | Prescription
    - returns specific prescription
PATCH (data: Prescription): InvalidAuth | InvalidData | Prescription
    - modifies prescription, and returns the resulting prescription data
DELETE (): InvalidAuth | InvalidData | Success
```





