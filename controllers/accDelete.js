const mysql = require("mysql");
const show = require("./auth");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.accDelete = (req, res) => {

    async function deleteAcc() {
        var email = show.email;
        const delete_id = await prisma.$queryRaw('SELECT id FROM user WHERE email = ?', email);
        var str = JSON.stringify(delete_id[0]);
        var res = str.split(":");
        var id_delete = res[1].split("}");
        console.log(id_delete[0]);
        var id = parseInt(id_delete[0], 10);
        
        const deleteUser = await prisma.user.delete({
            where: {
              id: id,
            },
          })
        console.log(deleteUser);
    }
    deleteAcc();
    res.redirect("/");
}


exports.nameChange = (req, res) => {
   
  async function updateName() {
      const { changeName } = req.body;
      var email = show.email;
      const delete_id = await prisma.$queryRaw('SELECT id FROM user WHERE email = ?', email);
      var str = JSON.stringify(delete_id[0]);
      var res = str.split(":");
      var id_delete = res[1].split("}");
      console.log(id_delete[0]);
      var id = parseInt(id_delete[0], 10);
      
      const updateUser = await prisma.user.update({
          where: {
            id: id,
          },
          data: {
              name: changeName,
          },
      })
  }
  updateName();
  res.redirect("/wallet");
}