const router = require("express").Router();
const Product = require("./model/products");
const ObjectId = require("mongoose").Types.ObjectId; // Requiring ObjectId from mongoose npm package
var jwt = require("jsonwebtoken");

/**
 * Add Product Route
 *
 * @route /product
 * @body json
 * @Reutnre json
 * @method POST
 *
 * Defination :
 * Use This Route To Add Product.
 */
router.post("/product", async (req, res) => {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      res.json(err);
    } else {
      console.log(authData);

      const pname = req.body.pname || "";
      const type = req.body.type || "";
      const regular_price = req.body.regular_price || "";
      const description = req.body.description || "";
      const short_description = req.body.short_description || "";
      const image = req.body.image || "";

      var isValidate = validateEmpty(res, req, [
        "pname",
        "type",
        "regular_price",
        "description",
      ]);

      if (isValidate["validate"]) {
        const newProduct = new Product({
          pname: pname,
          type: type,
          regular_price: regular_price,
          description: description,
          short_description: short_description,
          image: image,
        });

        const saveProduct = await newProduct.save();
        res.send(saveProduct);
      } else {
        res.send(isValidate);
      }
    }
  });
});

/**
 * Get All Product Route
 *
 * @route /product
 * @Reutnre json
 * @method GET
 *
 * Defination :
 * Use This Route To Get All Product.
 */
router.get("/product", async (req, res) => {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      res.json(err);
    } else {
      console.log(authData);
      const products_get_all = await Product.find({});
      res.json(products_get_all);
    }
  });
});

/**
 * Update Product Route
 *
 * @route /product/Product ID
 * @param id ( string )
 * @body json
 * @Reutnre json
 * @method PATCH
 *
 * Defination :
 * Use This Route To Update Product.
 */
router.patch("/product/:productid", async (req, res) => {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      res.json(err);
    } else {
      console.log(authData);

      const product_id = req.params.productid;

      const pname = req.body.pname;
      const type = req.body.type;
      const regular_price = req.body.regular_price;
      const description = req.body.description;
      const short_description = req.body.short_description;
      const image = req.body.image;

      if (isValidObjectId(product_id)) {
        try {
          await Product.updateOne(
            { _id: product_id },
            {
              $set: {
                pname: pname,
                type: type,
                regular_price: regular_price,
                description: description,
                short_description: short_description,
                image: image,
              },
            }
          ).then((result) => {
            return res.status(200).json({
              code: "0011",
              status: "200",
              message: "Product Updated Successfully",
            });
          });
        } catch (e) {
          console.log(e);
        }
      } else {
        const invalide_error = {
          code: "0001",
          status: "400",
          message: "Invalide object id",
        };

        res.status(400).json(invalide_error);
      }
    }
  });
});

/**
 * Delete Product Route
 *
 * @route /product/Product ID
 * @param id ( string )
 * @return json
 * @method DELETE
 *
 * Defination :
 * Use This Route To delete product.
 */
router.delete("/product/:productid", async (req, res) => {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      res.json(err);
    } else {
      console.log(authData);
      const product_id = req.params.productid;

      if (isValidObjectId(product_id)) {
        try {
          await Product.deleteOne({ _id: product_id }).then((result) => {
            console.log(result);
            return res.status(200).json({
              code: "0010",
              status: "200",
              message: "Product Deleted Successfully",
            });
          });
        } catch (e) {
          console.log(e);
        }
      } else {
        const invalide_error = {
          code: "0001",
          status: "400",
          message: "Invalide object id",
        };

        res.status(400).json(invalide_error);
      }
    }
  });
});

/**
 * Helper Fucntion
 *
 * @function isValidObjectId
 * @param id ( string )
 * @return boolean
 *
 * Defination :
 * Use This Function To check mongodb id validation.
 */

function isValidObjectId(id) {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) return true;
    return false;
  }
  return false;
}

/**
 * Helper Fucntion
 *
 * @function validateEmpty
 * @param requiredField ( array )
 * @return boolean
 *
 * Defination :
 * Use with route to check/validate required field.
 */

function validateEmpty(res, req, requiredField) {
  var validate_data = {};

  validate_data = {
    required: "All Good",
    validate: true,
  };

  requiredField.forEach((element) => {
    if (!req.body.hasOwnProperty(element)) {
      validate_data = {
        required: "Field " + element + " is requried",
        validate: false,
      };
    } else {
      if (req.body[element] == "") {
        validate_data = {
          required: "Field " + element + " must not be null.",
          validate: false,
        };
      }
    }
  });

  return validate_data;
}

module.exports = router;
