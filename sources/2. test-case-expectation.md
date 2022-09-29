Ceritanya Programmer lagi bikin ekspektasi aplikasinya mau memiliki kelakuan seperti apa nih ...

# Aplikasi Backend
----------
## Menambah Data Employee

### POST /employees

#### Case #1 (Ketika sukses POST /employees)

Request

Body (Object)
  - name: string
  - password: string
  - address: string

Response

Status: 201 - Created

Body (Object)
  - statusCode: integer
  - message: string

#### Case #2 (Ketika gagal POST /employees karena name tidak ada)

Request

Body (Object)
  - name: null
  - address: string

Response 

Status: 400 - Bad Request

Body (Object)
  - statusCode: integer
  - errorMessage: string

## Listing Data Employee

### GET /employees

#### Case #1 (Ketika sukses GET /employees)

Response

Status: 200 - OK

Body (Object)
  - statusCode: integer
  - data: Object
      - name: string
      - address: string
      - createdAt: timestamp
      - updatedAt: timestamp
      - CANNOT INCLUDE password
