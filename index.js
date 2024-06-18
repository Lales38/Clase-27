import express from "express";
import pool from "./config/db.js";
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Dedfinir las rutas aqui

//get all users
app.get("/users", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * from usuario");
    console.log("ROWS--> ", rows);
    connection.release();
    res.json(rows);
  } catch (err) {
    console.error("Error executing query: ", err);
    res.status(500);
  }
})

//get a specific user by id
app.get('/users:id', async (req, res) => {
  try {
    const id = req.query.id
    const connection = await pool.getConnection()
    const [rows] = await connection.query(
      'SELECT * from usuario WHERE id = ?',[id]
    )
    console.log(req)
    connection.release()
    if (rows.length === 0) {
      res.status(404).json({ message: "usuario no encontrado" })
    } else {
      res.json(rows)
    } 
  } catch (err) {
    console.error("Error executing query: ", err)
    res.status(500)
  }
})

//create new user
app.post("/users", async (req, res) => {
  try {
    console.log("req.body ---->: ", req.body);
    //const { nombre, email, password, rol } = req.body;
    const connection = await pool.getConnection();
    const [result] = await connection.query("INSERT INTO usuario SET ?", [
      req.body,
    ]);
    connection.release();
    res
      .status(201)
      .json({ message: "Usuario cargado exitosamente", id: result.insertId });
  } catch (err) {
    console.error("Error executing query: ", err);
    res.status(500);
  }
});

//update a specific user by id
app.post("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      "UPDATE usuario SET ? WHERE ID = ?",
      [req.body, id]
    );
    connection.release();
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "usuario no encontrado" });
    } else {
      res.json({ message: "Usuario actualizado con éxito" });
    }
  } catch (err) {
    console.error("Error executing query: ", err);
    res.status(500);
  }
});

//delete a specific user by id
app.get("/users/borrar/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'DELETE from usuario WHERE id = ?',
      [id]
    );
    connection.release();
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'usuario no encontrado' });
    } else {
      res.json({ message: 'Usuario borrado con éxito' });
    }
  } catch (err) {
    console.error("Error executing query: ", err);
    res.status(500);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000, venimos bien");
});
