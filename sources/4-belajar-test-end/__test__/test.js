const app = require("../app");
// kita akan menggunakan supertest
// https://www.npmjs.com/package/supertest
const request = require("supertest");

// 5. kita harus menggunakan sebuah siklus dalam pengetesan
// yang akan meminta si sequelize untuk meng-drop seluruh isi dari
// model yang digunakan (Employee) SEKALIGUS akan
// mereset id yang sudah ada (supaya akan selalu dimulai dari 1 lagi)

// supaya hal ini bisa terjadi, maka kita harus menggunakan siklus hidup (lifecycle)
// dari jest ini sendiri, dimana salah satunya adalah afterAll
// yang akan terjadi ketika seluruh test yang ada di file ini sudah kelar
// maka afterAll akan terjadi

// tapi sebelum itu, kita harus melakukan import terhadap sequelize
const { sequelize } = require("../models");
// selanjutnya kita akan menggunakan queryInterface dari sequelize supaya bisa menggunakan
// bulkInsert / bulkDelete
const { queryInterface } = sequelize;

afterAll(() => {
  // barulah di sini kita bisa menggunakan bulkDelete dan melakukan reset
  queryInterface.bulkDelete("Employees", null, {
    // Di sini kita harus menggunakan options agar bisa idnya kembali ke 1 lagi
    truncate: true,
    restartIdentity: true,
  });
});

// 1. mari kita deskripsikan dulu testnya mau apa
describe("POST /employees", () => {
  // 2. mari kita coba lakukan testnya ada apa saja

  // kita buat dulu data yang ingin dikirimkan
  const objUserYangDikirimkan = {
    name: "lalaland",
    password: "123456",
    address: "La La Land",
  };

  test("201 - Success Adding Employees", async () => {
    // 3. di sini untuk bisa menembak ke backend, kita akan menggunakan supertest
    // supaya kita bisa menggunakan fungsi async yang ada di atas
    // maka kita di sini akan menggunakan "return request"
    return (
      request(app)
        .post("/employees")
        // apabila ingin menggunakan headers, kita bisa menggunakan cara ini (.set)
        .set("Accept", "application/x-www-form-urlencoded")
        // apabila ada data yang ingin dikirimkan, kita bisa menggunakan cara ini (.send)
        .send(objUserYangDikirimkan)
        // di sini kita tidak menggunakan expect dari supertestnya secara langsung
        // namun menggunakan expect yang didapat dari jest
        // oleh karena itu kita akan menggunakan then-nable (promise alike)
        .then(
          // callback data kembalian (promise)
          (response) => {
            // baru kita buat ekspektasinya dengan jest

            // misalnya kita ekspektasi status codenya adalah 201
            expect(response.statusCode).toBe(201);
            // misalnya kita ingin mengecek apakah body kembalian merupakan suatu object
            expect(response.body).toBeInstanceOf(Object);
            // sekarang kita ingin mengecek apakah body.statusCode kembaliannya merupakan 201
            expect(response.body).toHaveProperty("statusCode", 201);
            // sekarang kita ingin mengecek apakah body.message tidak memiliki property password
            expect(response.body.message).not.toHaveProperty("password");
            // sekarang kita ingin mengecek apakah body.message punya property id yang isinya adalah number

            // 4. nah di sini kita akan mendapatkan masalah, karena test di bawah ini hanya bisa dijalankan
            // satu kali saja, karena id nya akan bertambah terus setiap kali dibuat

            // solusinya bagaimana? (coba lihat langkah 5.)
            expect(response.body.message).toBe(
              `Employee dengan id 1 berhasil dibuat`
            );
          }
        )
    );
  });

  // 6. Test itu umumnya kita tidak hanya mengetes dunia sempurnanya, tapi juga akan
  // mengetes tentang dunia tidak sempurnanya (errornya)
  test("400 - Error Bad Request when name is null", async () => {
    const objUserTanpaNama = {
      ...objUserYangDikirimkan,
      name: null,
    };

    // sekarang kita akan coba menggunakan cara async await
    // kita terima responsenya setelah menunggu si request.app
    const response = await request(app)
      .post("/employees")
      // set header yang sama dengan atas
      .set("Accept", "application/x-www-form-urlencoded")
      // set request body yang dikirimkan
      .send(objUserTanpaNama);

    // test ekspektasi yang diharapkan
    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    // ekspektasi: statusCode adalah 400
    expect(response.body).toHaveProperty("statusCode", 400);
    // ekspektasi: ada error message yang diberikan
    expect(response.body).toHaveProperty(
      "errorMessage",
      "Nama tidak boleh kosong"
    );
  });
});

// 7. Karena ini sudah mengenai GET /employees, maka kita akan deskripsikan yang baru lagi
describe("GET /employees", () => {
  // mari kita lakukan pengetesannya
  test("200 - Success Fetch Employees Data without Password", async () => {
    const response = await request(app).get("/employees");

    // test ekspektasi yang diinginkan
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    // ekspektasi statusCode adalah 200
    expect(response.body).toHaveProperty("statusCode", 200);
    // ekspektasi data adalah sebuah array
    expect(response.body.data).toBeInstanceOf(Array);
    // ekspektasi data indeks ke 0 tidak memiliki property password
    expect(response.body.data[0]).not.toHaveProperty("password");
    // ekspektasi data indeks ke 0 memiliki property id
    expect(response.body.data[0]).toHaveProperty("id");
  });
});
