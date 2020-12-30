'use strict';

import { describe, before, it } from 'mocha';
import { expect } from 'chai';
import range from 'lodash.range';
import sequential from 'promise-sequential';
import { PaginatedModel } from '../src';
import { Sequelize, Column, DataType, ForeignKey, Table, HasMany, Scopes } from 'sequelize-typescript';
import { Op } from 'sequelize';

@Table({ tableName: 'book' })
class Book extends PaginatedModel {
  @Column({ type: DataType.STRING })
  name: string;
  @ForeignKey(() => Author)
  @Column({ type: DataType.INTEGER })
  authorId: string;
}

@Table({ tableName: 'author' })
@Scopes(() => ({
  author1: {
    where: { name: { [Op.like]: 'author1%' } },
  },
}))
class Author extends PaginatedModel {
  @Column({ type: DataType.STRING })
  name: string;
  @HasMany(() => Book)
  books: Book[];
}

describe('sequelizePaginate', () => {
  before(async () => {
    const DATABASE = process.env.DATABASE || 'mysql://root:root@localhost/test';

    const sequelize = new Sequelize(DATABASE, {
      models: [Author, Book],
      logging: false,
    });
    await sequelize.authenticate();
    await Book.drop();
    await Author.drop();
    await Author.sync({ force: true });
    await Book.sync({ force: true });
    await sequential(
      range(1, 100).map((authorId) => {
        return () =>
          Author.create(
            {
              name: `author${authorId}`,
              books: range(1, 100).map((bookId) => ({ name: `book${bookId}` })),
            },
            {
              include: [Book],
            },
          );
      }),
    );
    return;
  });
  describe('', () => {
    it('should paginate with defaults', async () => {
      const { docs, pages, total } = await Author.paginate();
      expect(docs).to.be.an('array');
      expect(docs.length).to.equal(25);
      expect(pages).to.equal(4);
      expect(total).to.equal(99);
    });
  });

  it('should paginate with page and paginate', async () => {
    const { docs, pages, total } = await Author.paginate({
      page: 2,
      pageSize: 50,
    });
    expect(docs).to.be.an('array');
    expect(docs.length).to.equal(49);
    expect(pages).to.equal(2);
    expect(total).to.equal(99);
  });

  it('should paginate and ignore limit and offset', async () => {
    const { docs, pages, total } = await Author.paginate({
      limit: 2,
      offset: 50,
    });
    expect(docs).to.be.an('array');
    expect(docs.length).to.equal(25);
    expect(pages).to.equal(4);
    expect(total).to.equal(99);
  });

  it('should paginate with extras', async () => {
    const { docs, pages, total } = await Author.paginate({
      include: [Book],
      order: ['id'],
    });
    expect(docs).to.be.an('array');
    expect(docs.length).to.equal(25);
    expect(pages).to.equal(4);
    expect(total).to.equal(99);
    expect(docs[0].books).to.be.an('array');
    expect(docs[0].books.length).to.equal(99);
  });

  it('should paginate with defaults and group by statement', async () => {
    const group = ['id'];
    const { docs, pages, total } = await Author.paginate({ group });
    expect(docs).to.be.an('array');
    expect(docs.length).to.equal(25);
    expect(pages).to.equal(4);
    expect(total).to.equal(99);
  });

  it('should paginate with filters, order and paginate', async () => {
    const { docs, pages, total } = await Author.paginate({
      order: [['name', 'DESC']],
      where: { name: { [Op.like]: 'author1%' } },
      pageSize: 5,
    });
    expect(docs).to.be.an('array');
    expect(docs.length).to.equal(5);
    expect(pages).to.equal(3);
    expect(total).to.equal(11);
  });

  it('should paginate with custom scope', async () => {
    const { docs, pages, total } = await Author.scope('author1').paginate({
      order: [['name', 'DESC']],
      pageSize: 5,
    });
    expect(docs).to.be.an('array');
    expect(docs.length).to.equal(5);
    expect(pages).to.equal(3);
    expect(total).to.equal(11);
  });
});
