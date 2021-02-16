//configurando o servidor
const express = require("express")
const server = express()

//configurar servidor para apresentar arquivos extras
server.use(express.static('public'))

// habilitar o body do formulario
server.use(express.urlencoded({ extended: true }))

//Configurar conexão bd
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'doadores_sangue'
})

//configurando a templete engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true, // verdadeiro ou falso
})

//configurar apresentação da pagina
server.get("/", function (req, res) {
    db.query("SELECT * FROM doadores", function (err, result) {
        if (err) {
            console.log(err)
            return res.send("erro no banco de dados.")
        }

        const donors = result.rows

        return res.render("index.html", { donors })
    })
})

server.post("/", function (req, res) {
    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood
    const tel = req.body.tel
    const city = req.body.city

    if (name == "" || email == "" || blood == "" || tel == "" || city == "") {
        //return res.send("Todos os campos são obrigatorios!")
        window.open = "teste.html";    

    
    }

    //coloco valores dentro BD
    const query = `INSERT INTO doadores ("nome","email","tipo_sangue","telefone","cidade")
            VALUES ($1, $2, $3, $4, $5)`
    const values = [name, email, blood, tel, city]
    db.query(query, values, function (err) {
        if (err) {
            console.log(err)
            return res.send("erro no banco de dados.")
        }

        //if (err) return res.send("Erro no banco de dados.")
        return res.redirect("/")
    })
})

//ligar o servidor  e permitir o acesso na porta 3000
server.listen(3000, function () {
    console.log("Iniciei o servidor")
})