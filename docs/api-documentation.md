# API Documentation

Base URL: `http://localhost:5000/api`

---

## Students

### Create Student
`POST /students`

Body:
```json
{
  "student_number": "STD-001",
  "first_name": "Eric",
  "last_name": "Uwimana",
  "gender": "Male",
  "class_name": "Level 4",
  "department": "Software",
  "email": "eric@test.com",
  "phone": "0788000001"
}