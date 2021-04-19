// import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const findCategory = await categoryRepository.findOne({
      where: { category },
    });

    let categoryId = findCategory?.id;

    if (!findCategory) {
      const newCategory = categoryRepository.create({
        title: category,
      })
      await categoryRepository.save(newCategory);
      categoryId = newCategory.id;
    }
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: categoryId,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
