import { Request, Response } from 'express';
import { getAllProducts, getProductById, createProduct } from '../models/product.model';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const tenant = req.query.tenant as string | undefined;
    const products = await getAllProducts(tenant);
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProductHandler = async (req: Request, res: Response) => {
  try {
    const authReq = req as any;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, description, price, category, stock, image, tenant } = req.body;

    const product = await createProduct(
      name,
      description,
      price,
      userId,
      category,
      stock,
      image,
      tenant
    );

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


