var express  = require('express'); 
var app = express(); 
var port = 8080; 
var mssql = require('mssql'); 
// параметры соединения с бд
var config = {
	user: 'Michael',   				// пользователь базы данных
	password: 'MyPassword123', 	 			// пароль пользователя 
	server: 'localhost', 			// хост
	database: 'Library',    			// имя бд
	port: 1433,			 			// порт, на котором запущен sql server
    options: {
        encrypt: false,  // Использование SSL/TLS
        trustServerCertificate: true // Отключение проверки самоподписанного сертификата
    },
}
var allBooks=express.Router();
var booksByAuthor=express.Router();
var booksByPress=express.Router();
var allStudents=express.Router();
var studentsByGroup=express.Router();
var Teachers=express.Router();
var allFaculties=express.Router();
var connection = new mssql.ConnectionPool(config); 
function resData(param, ps, res){
	ps.prepare(param, function(err) {
				
		if (err) console.log(err); 

		// выполнение запроса 
		ps.execute({}, function(err, data) {
			if (err) console.log(err); 
			
			res.send(data.recordset); 
			console.log('prepared statement executed'); 					
		});
	});
}
allBooks.route('/').get(function(req, res){
	connection.connect(function(err){
		var ps=new mssql.PreparedStatement(connection);
		ps.input('param', mssql.NVarChar);
		let request = `SELECT * FROM BOOKS`;
		resData(request, ps, res);
	});
});
app.use('/allBooks', allBooks);

booksByAuthor.route('/').get(function(req, res){
	connection.connect(function(err){
		var ps=new mssql.PreparedStatement(connection);
		ps.input('param', mssql.NVarChar);
		let request = `SELECT * FROM Authors`;
		resData(request, ps, res);
	});
});
booksByAuthor.route('/:author').get(function(req, res){
	connection.connect(function(err){
		var ps=new mssql.PreparedStatement(connection);
		ps.input('param', mssql.NVarChar);
		let request = `SELECT Books.Name, Authors.FirstName, Authors.LastName FROM Books JOIN Authors ON Books.Id_Author=Author.Id WHERE Authors.LastName='${req.params.author}'`;
		resData(request, ps, res);
	});
});
app.use('/booksByAuthor', booksByAuthor);

booksByPress.route('/').get(function(req, res){
	connection.connect(function(err){
		var ps=new mssql.PreparedStatement(connection);
		ps.input('param', mssql.NVarChar);
		let request = `SELECT * FROM Press`;
		resData(request, ps, res);
	});
});
booksByPress.route('/:pressName').get(function(req, res){
	connection.connect(function(err){
		var ps=new mssql.PreparedStatement(connection);
		ps.input('param', mssql.NVarChar);
		let request = ` SELECT Books.Name, Authors.FirstName, Authors.LastName, Press.Name
		FROM Books JOIN Authors 
		ON Books.Id_Author = Authors.Id JOIN Press
		ON Books.id_Press = Press.id
		WHERE Press.Name = '${req.params.namePress}'`;
		resData(request, ps, res);
	});
});
app.use('/booksByPress', booksByPress);

allStudents.route('/').get(function(req, res){
	connection.connect(function(err){
		var ps=new mssql.PreparedStatement(connection);
		ps.input('param', mssql.NVarChar);
		let request = ` SELECT * 
		FROM Students`;
		resData(request, ps, res);
	});
});
app.use('/allStudents', allStudents);

studentsByGroup.route('/').get(function(req, res){
	connection.connect(function(err){
		var ps=new mssql.PreparedStatement(connection);
		ps.input('param', mssql.NVarChar);
		let request = ` SELECT * 
		FROM Groups`;
		resData(request, ps, res);
	});
});
studentsByGroup.route('/:groupName').get(function(req, res){
	connection.connect(function(err){
		var ps=new mssql.PreparedStatement(connection);
		ps.input('param', mssql.NVarChar);
		let request = `  SELECT *
		FROM Groups JOIN Students
		ON Students.Id_Group = Groups.Id
		WHERE Groups.Name =  '${req.params.nameGroup}'`;
		resData(request, ps, res);
	});
});
app.use('/studentsByGroup', studentsByGroup);


Teachers.route('/').get(function(req, res){
	connection.connect(function(err){
		var ps=new mssql.PreparedStatement(connection);
		ps.input('param', mssql.NVarChar);
		let request = `  SELECT *
		FROM Teachers`;
		resData(request, ps, res);
	});
});
app.use('/Teachers', Teachers);

allFaculties.route('/').get(function(req, res){
	connection.connect(function(err){
		var ps=new mssql.PreparedStatement(connection);
		ps.input('param', mssql.NVarChar);
		let request = `  SELECT *
		FROM Faculties`;
		resData(request, ps, res);
	});
});
app.use('/allFaculties', allFaculties);

app.listen(port, function() { 
	console.log('app listening on port ' + port); 

}); 