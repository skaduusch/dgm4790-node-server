const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
	});
};

exports.postAddProduct = (req, res) => {
	const {
		productCategory,
		title,
		imageUrl,
		price,
		description,
	} = req.body;
	const product = new Product({
		productCategory, title, price, description, imageUrl,
	});
	product
		.save()
		.then((result) => {
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.error(err);
		});
};

exports.getEditProduct = (req, res) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect('/');
	}
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then((product) => {
			if (!product) {
				return res.redirect('/');
			}
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product',
				path: '/admin/edit-product',
				editing: editMode,
				product,
			});
		})
		.catch((err) => console.error(err));
};

exports.postEditProduct = (req, res) => {
	const updatedProductCategory = req.body.productCategory;
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDesc = req.body.description;

	Product.findById(prodId).then((product) => {
		product.productCategory = updatedProductCategory;
		product.title = updatedTitle;
		product.price = updatedPrice;
		product.description = updatedDesc;
		product.imageUrl = updatedImageUrl;
		return product.save();
	})
		.then((result) => {
			res.redirect('/admin/products');
		})
		.catch((err) => console.error(err));
};

exports.getProducts = (req, res) => {
	Product.find()
		.then((products) => {
			res.render('admin/products', {
				prods: products,
				pageTitle: 'Admin Products',
				path: '/admin/products',
			});
		})
		.catch((err) => console.error(err));
};

exports.postDeleteProduct = (req, res) => {
	const prodId = req.body.productId;
	Product.findByIdAndRemove(prodId)
		.then(() => {
			res.redirect('/admin/products');
		})
		.catch((err) => console.error(err));
};
