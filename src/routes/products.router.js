import express from 'express'
import ProductsDao from '../daos/Mongo/products.dao.js'
const router = express.Router()

//Obtener productos con y sin limite
router.get('/', async(req, res) => {
  try {
    const { limit } = req.query
    if (!limit) {
      const products = await ProductsDao.getProducts()
      res.status(200).send({ status: 'success', payload: products })
    } else {
      const products = await ProductsDao.getProductsWithLimit(limit)
      res.status(200).send({ status: 'success', payload: products })
    } 
  } catch (error) {
    res.status(error.message).send({ status: `error ${error.message }`, error: error.cause })
  }
})

//Obtener un producto por su ID
router.get('/:pid', async(req, res) => {
  try {
    const product = await ProductsDao.getProductById(req.params.pid)
    res.status(200).send({ status: 'success', payload: product })
  } catch (error) {
    res.status(error.message).send({ status: `error ${error.message}`, error: error.cause })
  }
})

//Agregar un producto
router.post('/', async(req, res) => {
  try {
    await ProductsDao.addProduct(req.body)
    res.status(201).send({ status: 'success', message: 'Producto agregado correctamente' })
  } catch (error) {
    res.status(error.message).send({ status: `error ${error.message}`, error: error.cause })
  }
})

//Modificar un producto
router.put('/:pid', async(req, res) => {
  try {
    await ProductsDao.updateProduct(req.params.pid, req.body)
    res.status(200).send({ status: 'success', message: 'Producto actualizado correctamente' })
  } catch (error) {
    res.status(error.message).send({ status: `error ${error.message}`, error: error.cause })
  }
})

//Eliminar un producto
router.delete('/:pid', async(req, res) => {
  try {
    await ProductsDao.deleteProduct(req.params.pid)
    res.status(204).send()
  } catch (error) {
    res.status(error.message).send({ status: `error ${error.message}`, error: error.cause })
  }
})

export default router