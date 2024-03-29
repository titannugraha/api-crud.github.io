const { promises: fs } = require("fs");
const path = require("path");

class ProductController {
  static async getAll(req, res) {
    try {
      const jsonFilePath = path.join(process.cwd(), "data", "products.json");
      let products = await fs.readFile(jsonFilePath, "utf8");
      products = JSON.parse(products);

      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = limit * page;

      console.log(search);
      const filteredProducts = products.filter((product) => {
        return product.nama.toLowerCase().includes(search.toLowerCase());
      });

      console.log(filteredProducts);
      const totalRows = filteredProducts.length;
      const totalPage = Math.ceil(totalRows / limit);

      const paginatedProducts = filteredProducts.slice(offset, offset + limit);
      console.log(paginatedProducts);
      res.status(200).json({
        result: paginatedProducts,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async add(req, res) {
    try {
      const jsonFilePath = path.join(process.cwd(), "data", "products.json");
      let products = await fs.readFile(jsonFilePath, "utf8");
      products = JSON.parse(products);
      const { nama, hargaBeli, hargaJual, stok } = req.body;
      const foto = req.file.filename;
      let id = products[products.length - 1].id + 1;

      const existingProduct = products.find((product) => product.nama === nama);
      if (existingProduct) {
        return res.status(400).json({ message: "Product name already exists" });
      }
      const newProduct = {
        id,
        nama,
        hargaBeli,
        hargaJual,
        stok,
        foto,
      };

      products.push(newProduct);
      await fs.writeFile(
        jsonFilePath,
        JSON.stringify(products, null, 2),
        "utf8"
      );
      res.status(201).json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async delete(req, res) {
    try {
      const jsonFilePath = path.join(process.cwd(), "data", "products.json");
      let products = await fs.readFile(jsonFilePath, "utf8");
      products = JSON.parse(products);

      const productId = +req.params.id;

      const updatedProducts = products.filter(
        (product) => product.id !== productId
      );

      if (products.length === updatedProducts.length) {
        return res.status(404).json({ message: "Produk tidak ditemukan" });
      }

      res.status(200).json({
        message: `Berhasil dihapus pada ID produk ${productId}`,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Kesalahan Server Internal" });
    }
  }
  static async update(req, res) {
    try {
      const jsonFilePath = path.join(process.cwd(), "data", "products.json");
      let products = await fs.readFile(jsonFilePath, "utf8");
      products = JSON.parse(products);

      const productId = +req.params.id;
      const { nama, hargaBeli, hargaJual, stok } = req.body;
      const foto = req.file.filename;

      const productIndex = products.findIndex(
        (product) => product.id === productId
      );

      console.log(productIndex);
      if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found" });
      }

      let fotoPath = products[productIndex].foto;

      if (foto) {
        fotoPath = foto;
      }

      products[productIndex].nama = nama;
      products[productIndex].hargaBeli = hargaBeli;
      products[productIndex].hargaJual = hargaJual;
      products[productIndex].stok = stok;
      products[productIndex].foto = fotoPath;

      await fs.writeFile(
        jsonFilePath,
        JSON.stringify(products, null, 2),
        "utf8"
      );

      res.status(200).json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getById(req, res) {
    try {
      const jsonFilePath = path.join(process.cwd(), "data", "products.json");
      let products = await fs.readFile(jsonFilePath, "utf8");
      products = JSON.parse(products);
      const productId = +req.params.id;
      const productIndex = products.findIndex(
        (product) => product.id === productId
      );
      if (productIndex === -1) {
        console.log(productIndex);
        return res.status(404).json({ message: "Product not found" });
      }

      let result = products[productIndex];
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = ProductController;
