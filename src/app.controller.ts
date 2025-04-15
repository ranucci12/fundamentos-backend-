import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { z } from 'zod';
import { ZodvalidationPipe } from './pipes/zod-validation-pipe';
import { get } from 'http';

const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

const createProducsBodySchema = z.object({
  name: z.string().min(5).max(20),
  modelo: z.string().min(3).max(10),
  dateManufacture: z.string().date(),
  year: z.number().min(1900).max(2025),
  brand: z.string().min(5).max(20),
  email: z.string().email(),
  cpf: z.string().regex(regex),
})
const bodyValidationPipe = new ZodvalidationPipe(createProducsBodySchema);

type CreateProductBodySchema = z.infer<typeof createProducsBodySchema>;

@Controller("/product")
export class AppController {

  products: CreateProductBodySchema[] = [
    {
      name: "asasasas",
      modelo: "asasasas",
      dateManufacture: "010101",
      year: 2024,
      brand: "asaasasas",
      email: "asaasas@asasasas.com",
      cpf: "123.456.789-09"
    },
    {
      name: "dfdfdfdf",
      modelo: "dfdfdfdf",
      dateManufacture: "020202",
      year: 2023,
      brand: "dfdfdfdf",
      email: "dfdfdfd@dfdfdfdf.com",
      cpf: "987.654.321-00"
    }
  ];

  constructor() { }

  @Post()
  @HttpCode(201)
  create(@Body(bodyValidationPipe) Body: CreateProductBodySchema): string {
    return bodyValidationPipe.transform(Body);
  }

  @Get()
  get(): CreateProductBodySchema[] {
    return this.products;
  }

  @Put(':name')
  @HttpCode(200)
  update(@Param('name') name: string, @Body(bodyValidationPipe) body: CreateProductBodySchema): string {
    const productIndex = this.products.findIndex(product => product.name.toLowerCase() === name.toLowerCase());

    if (productIndex !== -1) {
      this.products[productIndex] = body;
      return "Produto atualizado com sucesso!";
    } else {
      return "Produto não encontrado";
    }
  }

  @Delete(':name')
  @HttpCode(204)
  delete(@Param('name') name: string): string {
    const productIndex = this.products.findIndex(product => product.name.toLowerCase() === name.toLowerCase());

    if (productIndex !== -1) {

      this.products.splice(productIndex, 1);
      return "Produto removido com sucesso!";
    } else {

      return "Produto não encontrado";
    }
  }
}