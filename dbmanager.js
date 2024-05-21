const {Client} = require('pg');
const express = require('express');
const bodyParser = require('body-parser');

const port = 9000;

const app = express();

app.use(express.static(__dirname));

app.set('view engine', 'ejs')

app.get("/", (req, res) => {
	res.render('mainPage', {data:""});
});

app.use(bodyParser.urlencoded({extended: false}));

app.get('/submit',function(req,res){
  console.log("Data Saved");
});

const client = new Client({
	host: "localhost",
	user: "postgres",
	port: 5432,
	password: "1111",
	database: "PhotoCenter"
});

client.connect();

/* PAGE NAVIGATION */

app.post("/mainPage", (req, res) => {
    res.render('mainPage', {data: null});
});

app.post("/ordersPage", (req, res) => {
    res.render('makeOrderPage', {data: null});
});

app.post("/formsPage", (req, res) => {
    res.render('formsPage', {data: null});
});

app.post("/tasksPage", (req, res) => {
    res.render('tasksPage', {data: null});
});

app.post("/tablesPage", (req, res) => {
    res.render('tablesPage', {data: null});
});

/* TASK QUERIES */

app.post("/getOrdersByDate", (req, res) => {
    const {start, end}=req.body;
		client.query("WITH Q1 AS(SELECT branches.address, COUNT(orders.id) as sum1 FROM branches, kiosks, orders WHERE orders.date >= $1 AND orders.date <= $2 AND orders.branch_id is NULL AND orders.kiosk_id = kiosks.id AND kiosks.branch_id = branches.id	GROUP BY branches.address),	Q2 AS (	SELECT branches.address, COUNT(orders.id) as sum2	FROM branches, orders	WHERE orders.is_paid_dev IS NOT NULL AND orders.date >= $1 AND orders.date <= $2 AND orders.kiosk_id is NULL AND orders.branch_id = branches.id	GROUP BY branches.address)	SELECT branches.address, (CASE WHEN Q1.sum1 IS NULL THEN Q2.sum2 + 0 WHEN Q2.sum2 IS NULL THEN Q1.sum1 + 0 ELSE Q1.sum1 + Q2.sum2 END) as sum3 FROM branches, Q1 FULL OUTER JOIN Q2 ON Q1.address = Q2.address WHERE Q1.address = branches.address OR Q2.address = branches.address GROUP BY branches.address, sum3", [start, end], (err, result) => {
		if (err) {
			res.render('taskOrdersTable', {data:""});
			console.log(err.message);
		} else {
			res.render('taskOrdersTable', {data:result.rows});
	  	}
		client.end;
	});
});

app.post("/getNumOfPhotosByDate", (req, res) => {
    const {start, end}=req.body;
		client.query("WITH Q1 AS(	SELECT branches.address, SUM(photos.quantity) as sum1	FROM photos, branches, kiosks, orders	WHERE photos.order_id = orders.id AND orders.is_paid_dev IS NULL AND orders.date >= $1 AND orders.date <= $2 AND orders.branch_id is NULL AND orders.kiosk_id = kiosks.id AND kiosks.branch_id = branches.id	GROUP BY branches.address),	Q2 AS (	SELECT branches.address, SUM(photos.quantity) as sum2	FROM photos, branches, orders	WHERE photos.order_id = orders.id AND orders.is_paid_dev IS NULL AND orders.date >= $1 AND orders.date <= $2 AND orders.kiosk_id is NULL AND orders.branch_id = branches.id	GROUP BY branches.address)	SELECT branches.address, (CASE WHEN Q1.sum1 IS NULL THEN Q2.sum2 + 0 WHEN Q2.sum2 IS NULL THEN Q1.sum1 + 0 ELSE Q1.sum1 + Q2.sum2 END) as sum3	FROM branches, Q1 FULL OUTER JOIN Q2 ON Q1.address = Q2.address WHERE Q1.address = branches.address OR Q2.address = branches.address	GROUP BY branches.address, sum3", [start, end], (err, result) => {
		if (err) {
			res.render('taskPhotosTable', {data:""});
			console.log(err.message);
		} else {
			res.render('taskPhotosTable', {data:result.rows});
	  	}
		client.end;
	});
});

app.post("/getRevenueByDate", (req, res) => {
    const {start, end}=req.body;
		client.query("WITH Q1 AS(SELECT branches.address, SUM(orders.price) as sum1 FROM branches, kiosks, orders WHERE orders.is_paid_dev IS NULL AND orders.date >= $1 AND orders.date <= $2 AND orders.branch_id is NULL AND orders.kiosk_id = kiosks.id AND kiosks.branch_id = branches.id	GROUP BY branches.address),	Q2 AS (	SELECT branches.address, SUM(orders.price) as sum2	FROM branches, orders	WHERE orders.is_paid_dev IS NULL AND orders.date >= $1 AND orders.date <= $2 AND orders.kiosk_id is NULL AND orders.branch_id = branches.id	GROUP BY branches.address)	SELECT branches.address, (CASE WHEN Q1.sum1 IS NULL THEN Q2.sum2 + 0 WHEN Q2.sum2 IS NULL THEN Q1.sum1 + 0 ELSE Q1.sum1 + Q2.sum2 END) as sum3 FROM branches, Q1 FULL OUTER JOIN Q2 ON Q1.address = Q2.address WHERE Q1.address = branches.address OR Q2.address = branches.address GROUP BY branches.address, sum3", [start, end], (err, result) => {
		if (err) {
			res.render('taskRevenueTable', {data:""});
			console.log(err.message);
		} else {
			res.render('taskRevenueTable', {data:result.rows});
	  	}
		client.end;
	});
});

app.post("/getNumOfFramesByDate", (req, res) => {
    const {start, end}=req.body;
		client.query("WITH Q1 AS(	SELECT branches.address, COUNT(frames.id) as sum1	FROM frames, branches, kiosks, orders	WHERE frames.order_id = orders.id AND orders.is_paid_dev IS NOT NULL AND orders.date >= $1 AND orders.date <= $2 AND orders.branch_id is NULL AND orders.kiosk_id = kiosks.id AND kiosks.branch_id = branches.id	GROUP BY branches.address),	Q2 AS (	SELECT branches.address, COUNT(frames.id) as sum2	FROM frames, branches, orders	WHERE frames.order_id = orders.id AND orders.is_paid_dev IS NOT NULL AND orders.date >= $1 AND orders.date <= $2 AND orders.kiosk_id is NULL AND orders.branch_id = branches.id	GROUP BY branches.address)	SELECT branches.address, (CASE WHEN Q1.sum1 IS NULL THEN Q2.sum2 + 0 WHEN Q2.sum2 IS NULL THEN Q1.sum1 + 0 ELSE Q1.sum1 + Q2.sum2 END) as sum3	FROM branches, Q1 FULL OUTER JOIN Q2 ON Q1.address = Q2.address WHERE Q1.address = branches.address OR Q2.address = branches.address	GROUP BY branches.address, sum3", [start, end], (err, result) => {
		if (err) {
			res.render('taskFramesTable', {data:""});
			console.log(err.message);
		} else {
			res.render('taskFramesTable', {data:result.rows});
	  	}
		client.end;
	});
});

app.post("/getSuppliersByProduct", (req, res) => {
    const {name}=req.body;
		client.query("SELECT suppliers.name FROM suppliers, supplies, products WHERE products.name = $1 AND (products.id = supplies.product_id AND supplies.supplier_id = suppliers.id) GROUP BY suppliers.name", [name], (err, result) => {
		if (err) {
			res.render('taskSuppliersTable', {data:""});
			console.log(err.message);
		} else {
			res.render('taskSuppliersTable', {data:result.rows});
	  	}
		client.end;
	});
});

app.post("/getClientsByBranch", (req, res) => {
    const {branch_id}=req.body;
		client.query("SELECT clients.name, clients.status, clients.card FROM clients, orders, kiosks, branches WHERE branches.id = $1 AND orders.client_id = clients.id AND orders.kiosk_id = kiosks.id AND kiosks.branch_id = branches.id GROUP BY clients.name, clients.status, clients.card UNION DISTINCT SELECT clients.name, clients.status, clients.card FROM clients, orders, kiosks, branches WHERE branches.id = $1 AND orders.client_id = clients.id AND orders.branch_id = branches.id GROUP BY clients.name, clients.status, clients.card", [branch_id], (err, result) => {
		if (err) {
			res.render('taskClientsTable', {data:""});
			console.log(err.message);
		} else {
			res.render('taskClientsTable', {data:result.rows});
	  	}
		client.end;
	});
});

app.post("/getRevenueByBranch", (req, res) => {
    const {}=req.body;
		client.query("SELECT Null as id, SUM(products.price * sales.quantity) FROM  products, sales WHERE sales.product_id = products.id UNION ALL SELECT branches.id, SUM(products.price * sales.quantity) FROM branches, products, sales WHERE sales.branch_id = branches.id AND sales.product_id = products.id GROUP BY branches.id", [], (err, result) => {
		if (err) {
			res.render('taskRevenueByBranchTable', {data:""});
			console.log(err.message);
		} else {
			res.render('taskRevenueByBranchTable', {data:result.rows});
	  	}
		client.end;
	});
});

app.post("/getMostProductsByBranch", (req, res) => {
    const {branch_id}=req.body;
		client.query("WITH Q1 AS(	SELECT products.id as pid, SUM(sales.quantity) as sum	FROM products, sales	WHERE sales.branch_id = $1 AND sales.product_id = products.id	GROUP BY products.id), Q2 AS (	SELECT products.id as pid	FROM Q1, products	WHERE Q1.sum = (SELECT MAX(Q1.sum) FROM Q1) AND Q1.pid = products.id) SELECT suppliers.name, products.name as product FROM suppliers, products, supplies, Q2 WHERE Suppliers.id = supplies.supplier_id AND supplies.product_id = products.id AND supplies.product_id = Q2.pid", [branch_id], (err, result) => {
		if (err) {
			res.render('taskProductsByBranchTable', {data:""});
			console.log(err.message);
		} else {
			res.render('taskProductsByBranchTable', {data:result.rows});
	  	}
		client.end;
	});
});

app.post("/getSalesByBranch", (req, res) => {
    const {branch_id}=req.body;
		client.query("SELECT products.name, SUM(sales.quantity) FROM products, sales WHERE products.id = sales.product_id AND sales.branch_id = $1 GROUP BY products.name", [branch_id], (err, result) => {
		if (err) {
			res.render('taskSalesByBranchTable', {data:""});
			console.log(err.message);
		} else {
			res.render('taskSalesByBranchTable', {data:result.rows});
	  	}
		client.end;
	});
});

/* CLIENT TABLE */

app.post("/getClientsTable", (req, res) => {
    const {}=req.body;
		client.query("SELECT * FROM clients ORDER BY clients.id", [], (err, result) => {
		if (err) {
			res.render('clientsTable', {data:""});
			console.log(err.message);
		} else {
			res.render('clientsTable', {data:result.rows});
	  	}
		client.end;
	});
});

app.post("/deleteClientData", (req, res) => {
    const {clientid}=req.body;
		client.query("DELETE FROM clients WHERE clients.id = $1", [clientid], (err, result) => {
		if (err) {
			res.render('clientsTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT * FROM clients ORDER BY clients.id", [], (err, result) => {
				if (err) {
					res.render('clientsTable', {data:""});
					console.log(err.message);
				} else {
					res.render('clientsTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/updClientData", (req, res) => {
    const {clientid, name, status, card}=req.body;
		client.query("UPDATE clients SET name = $2, status = $3, card = $4 WHERE id = $1", [clientid, name, status, card], (err, result) => {
		if (err) {
			res.render('clientsTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT * FROM clients ORDER BY clients.id", [], (err, result) => {
				if (err) {
					res.render('clientsTable', {data:""});
					console.log(err.message);
				} else {
					res.render('clientsTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/addNewClient", (req, resp) => {
	let ret = "OK";
    const {c_name, status, card}=req.body;
		client.query('INSERT INTO clients(name, status, card) VALUES ($1, $2, $3)', [c_name, status, card], (err, res) => {
			if (err) {
				console.log(err.message);
				ret = err.message;
			}
			client.end;
			resp.render('formsPage', { data: ret });
		});
});

/* PRODUCTS TABLE */

app.post("/getProductsTable", (req, res) => {
    const {}=req.body;
		client.query("SELECT * FROM products ORDER BY products.id", [], (err, result) => {
		if (err) {
			res.render('productsTable', {data:""});
			console.log(err.message);
		} else {
			res.render('productsTable', {data:result.rows});
	  	}
		client.end;
	});
});

app.post("/deleteProductData", (req, res) => {
    const {productid}=req.body;
		client.query("DELETE FROM products WHERE products.id = $1", [productid], (err, result) => {
		if (err) {
			res.render('productsTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT * FROM products ORDER BY products.id", [], (err, result) => {
				if (err) {
					res.render('productsTable', {data:""});
					console.log(err.message);
				} else {
					res.render('productsTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/updProductData", (req, res) => {
    const {productid, name, price}=req.body;
		client.query("UPDATE products SET name = $2, price = $3 WHERE id = $1", [productid, name, price], (err, result) => {
		if (err) {
			res.render('productsTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT * FROM products ORDER BY products.id", [], (err, result) => {
				if (err) {
					res.render('productsTable', {data:""});
					console.log(err.message);
				} else {
					res.render('productsTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/addNewProduct", (req, resp) => {
	let ret = "OK";
    const {name, price}=req.body;
	client.query('INSERT INTO products(name, price) VALUES ($1, $2)', [name, price], (err, res) => {
		if (err) {
			console.log(err.message);
			ret = err.message;
		}
		client.end;
		resp.render('formsPage', { data: ret });
	});
});


/* SALES TABLE */

app.post("/getSalesTable", (req, res) => {
    const {}=req.body;
		client.query("SELECT sales.id, branches.address, products.name, sales.quantity, sales.quantity * products.price as cost, sales.date FROM branches, products, sales WHERE sales.branch_id = branches.id AND sales.product_id = products.id ORDER BY sales.date", [], (err, result) => {
		if (err) {
			res.render('salesTable', {data:""});
			console.log(err.message);
		} else {
			res.render('salesTable', {data:result.rows});
	  	}
		client.end;
	});
});

app.post("/deleteSaleData", (req, res) => {
    const {saleid}=req.body;
		client.query("DELETE FROM sales WHERE sales.id = $1", [saleid], (err, result) => {
		if (err) {
			res.render('salesTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT sales.id, branches.address, products.name, sales.quantity * products.price as cost, sales.date FROM branches, products, sales WHERE sales.branch_id = branches.id AND sales.product_id = products.id ORDER BY sales.date", [], (err, result) => {
				if (err) {
					res.render('salesTable', {data:""});
					console.log(err.message);
				} else {
					res.render('salesTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/addNewSale", (req, resp) => {
	let ret = "OK";
    ({branch_id, product_id, quantity, date} = req.body);
		client.query("INSERT INTO sales (branch_id, product_id, quantity, date) VALUES ($1, $2, $3, $4)", [branch_id, product_id, quantity, date], (err, result) => {
			if (err) {
				console.log(err.message);
				ret = err.message;
			}
			client.end;
			resp.render('makeOrderPage', { data: ret });
		});
});

/* ORDERS TABLE */

app.post("/getOrdersTable", (req, res) => {
    const {}=req.body;
		client.query("SELECT * FROM orders ORDER BY orders.date", [], (err, result) => {
		if (err) {
			res.render('ordersTable', {data:""});
			console.log(err.message);
		} else {
			res.render('ordersTable', {data:result.rows});
	  	}
		client.end;
	});
});

app.post("/deleteOrderData", (req, res) => {
    const {orderid}=req.body;
		client.query("DELETE FROM orders WHERE orders.id = $1", [orderid], (err, result) => {
		if (err) {
			res.render('ordersTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT * FROM orders ORDER BY orders.date", [], (err, result) => {
				if (err) {
					res.render('ordersTable', {data:""});
					console.log(err.message);
				} else {
					res.render('ordersTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/updOrderData", (req, res) => {
    ({orderid, client_id, kiosk_id, branch_id, is_paid_dev, price, discount, urgency, date} = req.body);
		if(urgency == "true" && kiosk_id != ""){
			console.log("Can't make order with urgency in kiosk!");
			res.render('ordersTable', {data:""});
		} else {
			if(kiosk_id == "") {
				kiosk_id = null;
			}
			if(branch_id == "") {
				branch_id = null;
			}
			if(is_paid_dev == "") {
				is_paid_dev = null;
			}
			client.query("UPDATE orders SET client_id = $2, kiosk_id = $3, branch_id = $4, is_paid_dev = $5, price = $6, discount = $7, urgency = $8, date = $9 WHERE id = $1", [orderid, client_id, kiosk_id, branch_id, is_paid_dev, price, discount, urgency, date], (err, result) => {
				if (err) {
					res.render('ordersTable', {data:""});
					console.log(err.message);
				} else {
					client.query("SELECT * FROM orders ORDER BY orders.date", [], (err, result) => {
						if (err) {
							res.render('ordersTable', {data:""});
							console.log(err.message);
						} else {
							res.render('ordersTable', {data:result.rows});
						}
					});
				}
				client.end;
			});
		}
});

app.post("/addNewOrder", (req, resp) => {
	let ret = "OK";
    ({client_id, kiosk_id, branch_id, is_paid_dev, price, discount, urgency, date} = req.body);
		if((urgency == "true" && kiosk_id != "") || (kiosk_id != "" && branch_id != "")){
			ret = "Cant make order with urgency in kiosk or in kiosk and branch in one time!";
			console.log(ret);
			resp.render('makeOrderPage', { data: ret });
		} else {
			if(kiosk_id == "") {
				kiosk_id = null;
			}
			if(branch_id == "") {
				branch_id = null;
			}
			if(is_paid_dev == "") {
				is_paid_dev = null;
			}
			client.query("INSERT INTO orders (client_id, kiosk_id, branch_id, is_paid_dev, price, discount, urgency, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [client_id, kiosk_id, branch_id, is_paid_dev, price, discount, urgency, date], (err, result) => {
				if (err) {
					console.log(err.message);
					ret = err.message;
				}
				client.end;
				resp.render('makeOrderPage', { data: ret });
			});
		}
});

/* PHOTOS TABLE */

app.post("/getPhotosTable", (req, res) => {
    const {}=req.body;
		client.query("SELECT * FROM photos ORDER BY photos.order_id", [], (err, result) => {
		if (err) {
			res.render('photosTable', {data:""});
			console.log(err.message);
		} else {
			res.render('photosTable', {data:result.rows});
	  	}
		client.end;
	});
});

app.post("/deletePhotoData", (req, res) => {
    const {photoid}=req.body;
		client.query("DELETE FROM photos WHERE photos.id = $1", [photoid], (err, result) => {
		if (err) {
			res.render('photosTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT * FROM photos ORDER BY photos.order_id", [], (err, result) => {
				if (err) {
					res.render('photosTable', {data:""});
					console.log(err.message);
				} else {
					res.render('photosTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/updPhotoData", (req, res) => {
    const {photoid, order_id, paper_format, paper_type, quantity, number}=req.body;
		client.query("UPDATE photos SET order_id = $2, paper_format = $3, paper_type = $4, quantity = $5, number = $6 WHERE id = $1", [photoid, order_id, paper_format, paper_type, quantity, number], (err, result) => {
		if (err) {
			res.render('photosTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT * FROM photos ORDER BY photos.order_id", [], (err, result) => {
				if (err) {
					res.render('photosTable', {data:""});
					console.log(err.message);
				} else {
					res.render('photosTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/addNewPhoto", (req, resp) => {
	let ret = "OK";
    ({order_id, paper_format, paper_type, quantity, number} = req.body);
		client.query("INSERT INTO photos (order_id, paper_format, paper_type, quantity, number) VALUES ($1, $2, $3, $4, $5)", [order_id, paper_format, paper_type, quantity, number], (err, result) => {
			if (err) {
				console.log(err.message);
				ret = err.message;
			}
			client.end;
			resp.render('makeOrderPage', { data: ret });
		});
});

/* FRAMES TABLE */

app.post("/getFramesTable", (req, res) => {
    const {}=req.body;
		client.query("SELECT * FROM frames ORDER BY frames.order_id", [], (err, result) => {
		if (err) {
			res.render('framesTable', {data:""});
			console.log(err.message);
		} else {
			res.render('framesTable', {data:result.rows});
	  	}
		client.end;
	});
});

app.post("/deleteFrameData", (req, res) => {
    const {frameid}=req.body;
		client.query("DELETE FROM frames WHERE frames.id = $1", [frameid], (err, result) => {
		if (err) {
			res.render('framesTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT * FROM frames ORDER BY frames.order_id", [], (err, result) => {
				if (err) {
					res.render('framesTable', {data:""});
					console.log(err.message);
				} else {
					res.render('framesTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/updFrameData", (req, res) => {
    const {frameid, order_id, frame_number}=req.body;
		client.query("UPDATE frames SET order_id = $2, frame_number = $3 WHERE id = $1", [frameid, order_id, frame_number], (err, result) => {
		if (err) {
			res.render('framesTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT * FROM frames ORDER BY frames.order_id", [], (err, result) => {
				if (err) {
					res.render('framesTable', {data:""});
					console.log(err.message);
				} else {
					res.render('framesTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/addNewFrame", (req, resp) => {
	let ret = "OK";
    ({order_id, frame_number} = req.body);
		client.query("INSERT INTO frames (order_id, frame_number) VALUES ($1, $2)", [order_id, frame_number], (err, result) => {
			if (err) {
				console.log(err.message);
				ret = err.message;
			}
			client.end;
			resp.render('makeOrderPage', { data: ret });
		});
});

/* SERVICES TABLE */

app.post("/getServicesTable", (req, res) => {
    const {}=req.body;
		client.query("SELECT * FROM services ORDER BY services.date", [], (err, result) => {
		if (err) {
			res.render('servicesTable', {data:""});
			console.log(err.message);
		} else {
			res.render('servicesTable', {data:result.rows});
	  	}
		client.end;
	});
});

app.post("/deleteServiceData", (req, res) => {
    const {serviceid}=req.body;
		client.query("DELETE FROM services WHERE services.id = $1", [serviceid], (err, result) => {
		if (err) {
			res.render('servicesTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT * FROM services ORDER BY services.date", [], (err, result) => {
				if (err) {
					res.render('servicesTable', {data:""});
					console.log(err.message);
				} else {
					res.render('servicesTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/updServiceData", (req, res) => {
    const {serviceid, branch_id, service_type, price, date}=req.body;
		client.query("UPDATE services SET branch_id = $2, service_type = $3, price = $4, date = $5 WHERE id = $1", [serviceid, branch_id, service_type, price, date], (err, result) => {
		if (err) {
			res.render('servicesTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT * FROM services ORDER BY services.date", [], (err, result) => {
				if (err) {
					res.render('servicesTable', {data:""});
					console.log(err.message);
				} else {
					res.render('servicesTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/addNewService", (req, resp) => {
	let ret = "OK";
    ({branch_id, service_type, price, date} = req.body);
		client.query("INSERT INTO services (branch_id, service_type, price, date) VALUES ($1, $2, $3, $4)", [branch_id, service_type, price, date], (err, result) => {
			if (err) {
				console.log(err.message);
				ret = err.message;
			}
			client.end;
			resp.render('makeOrderPage', { data: ret });
		});
});

/* SUPPLIERS TABLE */

app.post("/getSuppliersTable", (req, res) => {
    const {}=req.body;
		client.query("SELECT * FROM suppliers ORDER BY suppliers.id", [], (err, result) => {
		if (err) {
			res.render('suppliersTable', {data:""});
			console.log(err.message);
		} else {
			res.render('suppliersTable', {data:result.rows});
	  	}
		client.end;
	});
});

app.post("/deleteSupplierData", (req, res) => {
    const {supplierid}=req.body;
		client.query("DELETE FROM suppliers WHERE suppliers.id = $1", [supplierid], (err, result) => {
		if (err) {
			res.render('suppliersTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT * FROM suppliers ORDER BY suppliers.id", [], (err, result) => {
				if (err) {
					res.render('suppliersTable', {data:""});
					console.log(err.message);
				} else {
					res.render('suppliersTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/updSupplierData", (req, res) => {
    const {supplierid, address, name}=req.body;
		client.query("UPDATE suppliers SET address = $2, name = $3 WHERE id = $1", [supplierid, address, name], (err, result) => {
		if (err) {
			res.render('suppliersTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT * FROM suppliers ORDER BY suppliers.id", [], (err, result) => {
				if (err) {
					res.render('suppliersTable', {data:""});
					console.log(err.message);
				} else {
					res.render('suppliersTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/addNewSupplier", (req, resp) => {
	let ret = "OK";
    const {address, s_name}=req.body;
		client.query('INSERT INTO suppliers(address, name) VALUES ($1, $2)', [address, s_name], (err, res) => {
			if (err) {
				console.log(err.message);
				ret = err.message;
			}
			client.end;
			resp.render('formsPage', { data: ret });
		});
});

/* SUPPLIES TABLE */

app.post("/getSuppliesTable", (req, res) => {
    const {}=req.body;
		client.query("SELECT * FROM supplies ORDER BY supplies.date", [], (err, result) => {
		if (err) {
			res.render('suppliesTable', {data:""});
			console.log(err.message);
		} else {
			res.render('suppliesTable', {data:result.rows});
	  	}
		client.end;
	});
});

app.post("/deleteSupplyData", (req, res) => {
    const {supplyid}=req.body;
		client.query("DELETE FROM supplies WHERE supplies.id = $1", [supplyid], (err, result) => {
		if (err) {
			res.render('suppliesTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT * FROM supplies ORDER BY supplies.date", [], (err, result) => {
				if (err) {
					res.render('suppliesTable', {data:""});
					console.log(err.message);
				} else {
					res.render('suppliesTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/updSupplyData", (req, res) => {
    const {supplyid, office_id, supplier_id, product_id, quantity, date}=req.body;
		client.query("UPDATE supplies SET office_id = $2, supplier_id = $3, product_id = $4, quantity = $5, date = $6 WHERE id = $1", [supplyid, office_id, supplier_id, product_id, quantity, date], (err, result) => {
		if (err) {
			res.render('suppliesTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT * FROM supplies ORDER BY supplies.date", [], (err, result) => {
				if (err) {
					res.render('suppliesTable', {data:""});
					console.log(err.message);
				} else {
					res.render('suppliesTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/addNewSupply", (req, resp) => {
	let ret = "OK";
    const {office_id, supplier_id, product_id, quantity, date}=req.body;
		client.query('INSERT INTO supplies(office_id, supplier_id, product_id, quantity, date) VALUES ($1, $2, $3, $4, $5)', [office_id, supplier_id, product_id, quantity, date], (err, res) => {
			if (err) {
				console.log(err.message);
				ret = err.message;
			}
			client.end;
			resp.render('formsPage', { data: ret });
		});
});

/* KIOSKS TABLE */

app.post("/getKiosksTable", (req, res) => {
    const {}=req.body;
		client.query("SELECT * FROM kiosks ORDER BY kiosks.id", [], (err, result) => {
		if (err) {
			res.render('kiosksTable', {data:""});
			console.log(err.message);
		} else {
			res.render('kiosksTable', {data:result.rows});
	  	}
		client.end;
	});
});

app.post("/deleteKioskData", (req, res) => {
    const {kioskid}=req.body;
		client.query("DELETE FROM kiosks WHERE kiosks.id = $1", [kioskid], (err, result) => {
		if (err) {
			res.render('kiosksTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT * FROM kiosks ORDER BY kiosks.id", [], (err, result) => {
				if (err) {
					res.render('kiosksTable', {data:""});
					console.log(err.message);
				} else {
					res.render('kiosksTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/updKioskData", (req, res) => {
    const {kioskid, branch_id, address, quantity}=req.body;
		client.query("UPDATE kiosks SET branch_id = $2, address = $3, quantity = $4 WHERE id = $1", [kioskid, branch_id, address, quantity], (err, result) => {
		if (err) {
			res.render('kiosksTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT * FROM kiosks ORDER BY kiosks.id", [], (err, result) => {
				if (err) {
					res.render('kiosksTable', {data:""});
					console.log(err.message);
				} else {
					res.render('kiosksTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/addNewKiosk", (req, resp) => {
	let ret = "OK";
    const {branch_id, address, quantity}=req.body;
		client.query('INSERT INTO kiosks(branch_id, address, quantity) VALUES ($1, $2, $3)', [branch_id, address, quantity], (err, res) => {
			if (err) {
				console.log(err.message);
				ret = err.message;
			}
			client.end;
			resp.render('formsPage', { data: ret });
		});
});

/* BRANCHES TABLE */

app.post("/getBranchesTable", (req, res) => {
    const {}=req.body;
		client.query("SELECT * FROM branches ORDER BY branches.id", [], (err, result) => {
		if (err) {
			res.render('branchesTable', {data:""});
			console.log(err.message);
		} else {
			res.render('branchesTable', {data:result.rows});
	  	}
		client.end;
	});
});

app.post("/deleteBranchData", (req, res) => {
    const {branchid}=req.body;
		client.query("DELETE FROM branches WHERE branches.id = $1", [branchid], (err, result) => {
		if (err) {
			res.render('branchesTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT * FROM branches ORDER BY branches.id", [], (err, result) => {
				if (err) {
					res.render('branchesTable', {data:""});
					console.log(err.message);
				} else {
					res.render('branchesTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/updBranchData", (req, res) => {
    const {branchid, office_id, address, quantity}=req.body;
		client.query("UPDATE branches SET office_id = $2, address = $3, quantity = $4 WHERE id = $1", [branchid, office_id, address, quantity], (err, result) => {
		if (err) {
			res.render('branchesTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT * FROM branches ORDER BY branches.id", [], (err, result) => {
				if (err) {
					res.render('branchesTable', {data:""});
					console.log(err.message);
				} else {
					res.render('branchesTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/addNewBranch", (req, resp) => {
	let ret = "OK";
    const {office_id, address, quantity}=req.body;
		client.query('INSERT INTO branches(office_id, address, quantity) VALUES ($1, $2, $3)', [office_id, address, quantity], (err, res) => {
			if (err) {
				console.log(err.message);
				ret = err.message;
			}
			client.end;
			resp.render('formsPage', { data: ret });
		});
});

/* OFFICES TABLE */

app.post("/getOfficesTable", (req, res) => {
    const {}=req.body;
		client.query("SELECT * FROM offices ORDER BY offices.id", [], (err, result) => {
		if (err) {
			res.render('officesTable', {data:""});
			console.log(err.message);
		} else {
			res.render('officesTable', {data:result.rows});
	  	}
		client.end;
	});
});

app.post("/deleteOfficeData", (req, res) => {
    const {officeid}=req.body;
		client.query("DELETE FROM offices WHERE offices.id = $1", [officeid], (err, result) => {
		if (err) {
			res.render('officesTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT * FROM offices ORDER BY offices.id", [], (err, result) => {
				if (err) {
					res.render('officesTable', {data:""});
					console.log(err.message);
				} else {
					res.render('officesTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/updOfficeData", (req, res) => {
    const {officeid, address}=req.body;
		client.query("UPDATE offices SET address = $2 WHERE id = $1", [officeid, address], (err, result) => {
		if (err) {
			res.render('officesTable', {data:""});
			console.log(err.message);
		} else {
			client.query("SELECT * FROM offices ORDER BY offices.id", [], (err, result) => {
				if (err) {
					res.render('officesTable', {data:""});
					console.log(err.message);
				} else {
					res.render('officesTable', {data:result.rows});
				}
			});
		}
		client.end;
	});
});

app.post("/addNewOffice", (req, resp) => {
	let ret = "OK";
    const {address}=req.body;
		client.query('INSERT INTO offices(address) VALUES ($1)', [address], (err, res) => {
			if (err) {
				console.log(err.message);
				ret = err.message;
			}
			client.end;
			resp.render('formsPage', { data: ret });
		});
});

app.listen(port, () => {
	console.log(`Server started!`);
});